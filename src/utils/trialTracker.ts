/**
 * TrialTracker - 비로그인 사용자 무료 체험 추적 시스템
 *
 * 다중 저장소 백업 전략:
 * 1. localStorage (메인)
 * 2. sessionStorage (백업)
 * 3. Cookie (백업, 30일 유지)
 * 4. IndexedDB (백업, 삭제하기 어려움)
 * 5. 브라우저 핑거프린트 (변경 감지)
 */

interface TrialData {
  count: number;
  firstTrial: string; // ISO timestamp
  lastTrial: string;  // ISO timestamp
  fingerprint: string; // 브라우저 핑거프린트
}

class TrialTracker {
  private readonly STORAGE_KEY = 'dreamics_trial_v1';
  private readonly BACKUP_KEY = 'dreamics_backup_v1';
  private readonly SESSION_KEY = 'dreamics_session';
  private readonly DB_NAME = 'DreamicsDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'trials';

  /**
   * 브라우저 핑거프린트 생성
   * User-Agent, 언어, 타임존, 화면 정보를 조합하여 고유 식별자 생성
   */
  private generateFingerprint(): string {
    const data = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset().toString(),
      screen.width.toString(),
      screen.height.toString(),
      screen.colorDepth.toString(),
    ].join('|');

    // Base64 인코딩 (간단한 해시)
    return btoa(data);
  }

  /**
   * IndexedDB 열기
   */
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * IndexedDB에 저장
   */
  private async saveToIndexedDB(data: TrialData): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      await store.put({ id: 1, ...data });
      db.close();
    } catch (error) {
      console.error('IndexedDB save failed:', error);
    }
  }

  /**
   * IndexedDB에서 읽기
   */
  private async getFromIndexedDB(): Promise<TrialData | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve) => {
        const request = store.get(1);
        request.onsuccess = () => {
          const result = request.result;
          db.close();
          if (result && result.count !== undefined) {
            resolve({
              count: result.count,
              firstTrial: result.firstTrial,
              lastTrial: result.lastTrial,
              fingerprint: result.fingerprint,
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => {
          db.close();
          resolve(null);
        };
      });
    } catch (error) {
      console.error('IndexedDB read failed:', error);
      return null;
    }
  }

  /**
   * Cookie에서 데이터 읽기
   */
  private getFromCookie(): TrialData | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === this.BACKUP_KEY) {
        try {
          return JSON.parse(atob(value));
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * 다중 저장소에 데이터 저장
   */
  private saveTrialData(data: TrialData): void {
    const json = JSON.stringify(data);

    // 1. localStorage (메인)
    try {
      localStorage.setItem(this.STORAGE_KEY, json);
    } catch (e) {
      console.error('localStorage save failed:', e);
    }

    // 2. sessionStorage (백업 1)
    try {
      sessionStorage.setItem(this.SESSION_KEY, json);
    } catch (e) {
      console.error('sessionStorage save failed:', e);
    }

    // 3. Cookie (백업 2 - 30일 유지)
    try {
      document.cookie = `${this.BACKUP_KEY}=${btoa(json)}; max-age=2592000; path=/; SameSite=Lax`;
    } catch (e) {
      console.error('Cookie save failed:', e);
    }

    // 4. IndexedDB (백업 3 - 비동기)
    this.saveToIndexedDB(data);
  }

  /**
   * 다중 저장소에서 데이터 읽기 (우선순위: localStorage → sessionStorage → Cookie → IndexedDB)
   */
  private async getTrialData(): Promise<TrialData | null> {
    // 1. localStorage에서 읽기
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('localStorage read failed:', e);
    }

    // 2. sessionStorage에서 복구
    try {
      const session = sessionStorage.getItem(this.SESSION_KEY);
      if (session) {
        const data = JSON.parse(session);
        this.saveTrialData(data); // localStorage에 복원
        return data;
      }
    } catch (e) {
      console.error('sessionStorage read failed:', e);
    }

    // 3. Cookie에서 복구
    try {
      const cookieData = this.getFromCookie();
      if (cookieData) {
        this.saveTrialData(cookieData); // localStorage에 복원
        return cookieData;
      }
    } catch (e) {
      console.error('Cookie read failed:', e);
    }

    // 4. IndexedDB에서 복구
    try {
      const indexedDBData = await this.getFromIndexedDB();
      if (indexedDBData) {
        this.saveTrialData(indexedDBData); // localStorage에 복원
        return indexedDBData;
      }
    } catch (e) {
      console.error('IndexedDB read failed:', e);
    }

    return null;
  }

  /**
   * 체험 가능 여부 확인
   * @returns true: 체험 가능 (0회), false: 체험 불가 (1회 이상)
   */
  public async canTrial(): Promise<boolean> {
    const data = await this.getTrialData();

    if (!data) return true; // 첫 방문

    // 핑거프린트 체크 (브라우저 변경 감지)
    const currentFingerprint = this.generateFingerprint();
    if (data.fingerprint !== currentFingerprint) {
      // 핑거프린트가 다르면 의심스럽지만 일단 허용 (다른 디바이스일 수 있음)
      console.warn('[TrialTracker] Different browser fingerprint detected');
    }

    return data.count < 1; // 1회만 허용
  }

  /**
   * 체험 기록
   */
  public async recordTrial(): Promise<void> {
    const existing = await this.getTrialData();
    const now = new Date().toISOString();

    const data: TrialData = existing
      ? {
          count: existing.count + 1,
          firstTrial: existing.firstTrial,
          lastTrial: now,
          fingerprint: this.generateFingerprint(),
        }
      : {
          count: 1,
          firstTrial: now,
          lastTrial: now,
          fingerprint: this.generateFingerprint(),
        };

    this.saveTrialData(data);
  }

  /**
   * 체험 횟수 조회
   */
  public async getTrialCount(): Promise<number> {
    const data = await this.getTrialData();
    return data?.count || 0;
  }

  /**
   * 체험 데이터 초기화 (테스트용)
   */
  public async reset(): Promise<void> {
    // localStorage
    localStorage.removeItem(this.STORAGE_KEY);

    // sessionStorage
    sessionStorage.removeItem(this.SESSION_KEY);

    // Cookie
    document.cookie = `${this.BACKUP_KEY}=; max-age=0; path=/`;

    // IndexedDB
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      await store.delete(1);
      db.close();
    } catch (e) {
      console.error('IndexedDB reset failed:', e);
    }
  }
}

export const trialTracker = new TrialTracker();
