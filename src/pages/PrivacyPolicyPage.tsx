import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>뒤로 가기</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-purple-400" size={32} />
            <h1 className="text-4xl font-bold">개인정보 처리방침</h1>
          </div>
          <p className="text-gray-400">Privacy Policy</p>
          <p className="text-sm text-gray-500 mt-2">최종 업데이트: 2025년 3월 3일</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 space-y-6"
        >
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">1. 개인정보 처리방침 개요</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dreamics.ai("회사", "우리")는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다.
            </p>
            <p className="text-gray-300 leading-relaxed">
              본 방침은 회사가 제공하는 AI 꿈 웹툰 및 스토리 생성 서비스에서 수집하는 개인정보의 항목, 이용 목적, 보유 및 이용 기간, 제3자 제공 여부 등을 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">2. 수집하는 개인정보 항목</h2>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">2.1 필수 정보</h3>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-gray-300 mb-3"><strong>회원가입 시:</strong></p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li><strong>소셜 로그인 (카카오):</strong> 카카오 계정 ID, 이메일 주소, 프로필 이미지 (선택)</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">2.2 서비스 이용 과정에서 자동 수집되는 정보</h3>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li><strong>기기 정보:</strong> IP 주소, 브라우저 종류, OS 정보, 기기 식별자</li>
                <li><strong>이용 기록:</strong> 접속 시간, 방문 페이지, 클릭 이벤트, 서비스 이용 기록</li>
                <li><strong>쿠키:</strong> 세션 유지, 로그인 상태 관리, 분석 도구 (Google Analytics 등)</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">2.3 사용자 생성 콘텐츠</h3>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li><strong>꿈 일기 텍스트:</strong> 사용자가 입력한 꿈 이야기</li>
                <li><strong>감정 선택:</strong> 기쁨, 불안, 분노, 슬픔, 놀람, 평온 등 감정 태그</li>
                <li><strong>AI 대화 기록:</strong> AI 스토리 확장 채팅 내용</li>
                <li><strong>생성된 웹툰 이미지:</strong> AI가 생성한 4컷 웹툰 (서버 저장)</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">2.4 결제 정보 (Polar.sh 처리)</h3>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm mb-2">
                <strong>중요:</strong> 결제 정보는 Dreamics.ai 서버에 저장되지 않습니다.
              </p>
              <p className="text-gray-300 text-sm">
                모든 결제 처리는 <strong>Polar.sh</strong>를 통해 이루어지며, Polar의 개인정보 처리방침이 적용됩니다. 우리는 다음 정보만 수신합니다:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm mt-2 space-y-1">
                <li>구독 플랜 (PLUS, PRO, ULTRA)</li>
                <li>구독 상태 (활성, 취소, 만료)</li>
                <li>구독 시작일 및 갱신일</li>
                <li>Polar 고객 ID (결제 카드 정보는 미수신)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">3. 개인정보 수집 및 이용 목적</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">🔐 회원 관리</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>회원 가입 및 본인 확인</li>
                  <li>로그인 세션 관리 (카카오 OAuth)</li>
                  <li>부정 이용 방지 및 계정 보안</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">🎨 서비스 제공</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>AI 웹툰 생성 및 스토리 확장</li>
                  <li>감정 태그 기반 콘텐츠 필터링</li>
                  <li>꿈 일기 저장 및 라이브러리 관리</li>
                  <li>구독 플랜에 따른 기능 제한 관리</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">💳 결제 및 환불 처리</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Polar.sh 연동 구독 관리</li>
                  <li>결제 완료/실패 웹훅 처리</li>
                  <li>환불 요청 검토 (사용 이력 확인)</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">📊 서비스 개선 및 분석</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>AI 모델 학습 (익명화된 꿈 데이터)</li>
                  <li>사용자 경험 개선 (A/B 테스트, 기능 사용률 분석)</li>
                  <li>서비스 오류 모니터링 및 버그 수정</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">📢 마케팅 및 광고 (선택적 동의)</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>신규 기능 안내 이메일 발송</li>
                  <li>프로모션 및 이벤트 정보 제공</li>
                  <li>맞춤형 콘텐츠 추천</li>
                </ul>
                <p className="text-gray-400 text-xs mt-2">
                  * 마케팅 정보 수신은 언제든지 거부할 수 있으며, 서비스 이용에 영향을 주지 않습니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">4. 개인정보 보유 및 이용 기간</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">회원 탈퇴 시</h3>
                <p className="text-gray-300 text-sm">
                  회원 탈퇴 즉시 모든 개인정보는 <strong>즉시 삭제</strong>됩니다. 단, 법령에 따라 보존이 필요한 경우는 예외입니다.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">법령에 따른 보존</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                  <li>
                    <strong>계약 또는 청약철회 기록:</strong> 5년 (전자상거래법)
                  </li>
                  <li>
                    <strong>대금결제 및 재화 공급 기록:</strong> 5년 (전자상거래법)
                  </li>
                  <li>
                    <strong>소비자 불만/분쟁 처리 기록:</strong> 3년 (전자상거래법)
                  </li>
                  <li>
                    <strong>웹사이트 방문 기록:</strong> 3개월 (통신비밀보호법)
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">익명화 데이터</h3>
                <p className="text-gray-300 text-sm">
                  AI 모델 학습에 사용된 꿈 데이터는 <strong>개인 식별 정보가 완전히 제거</strong>된 후 영구 보존될 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">5. 개인정보 제3자 제공</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-yellow-200 font-semibold mb-2">
                원칙: 사용자 동의 없이 제3자에게 개인정보를 제공하지 않습니다.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">예외 사항 (법률적 의무)</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li>수사 기관의 법적 요청 (영장 제시 시)</li>
              <li>정보통신망법 등 법률에 의해 요구되는 경우</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-purple-300 mt-4">서비스 제공을 위한 제3자 연동</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <table className="w-full text-sm text-gray-300">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left py-2">제공받는 자</th>
                    <th className="text-left py-2">제공 목적</th>
                    <th className="text-left py-2">제공 항목</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3">Polar.sh</td>
                    <td className="py-3">구독 결제 처리</td>
                    <td className="py-3">이메일, 구독 플랜</td>
                  </tr>
                  <tr>
                    <td className="py-3">Kakao</td>
                    <td className="py-3">소셜 로그인</td>
                    <td className="py-3">카카오 ID, 이메일</td>
                  </tr>
                  <tr>
                    <td className="py-3">OpenAI/Claude</td>
                    <td className="py-3">AI 콘텐츠 생성</td>
                    <td className="py-3">꿈 텍스트 (익명화)</td>
                  </tr>
                  <tr>
                    <td className="py-3">AWS/Vercel</td>
                    <td className="py-3">서버 호스팅</td>
                    <td className="py-3">이미지 파일, 로그</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">6. 개인정보 처리 위탁</h2>
            <p className="text-gray-300 mb-4">
              회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:
            </p>
            <div className="bg-white/5 rounded-lg p-4">
              <table className="w-full text-sm text-gray-300">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left py-2">수탁업체</th>
                    <th className="text-left py-2">위탁 업무</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3">AWS (Amazon Web Services)</td>
                    <td className="py-3">클라우드 서버 운영, 데이터 저장</td>
                  </tr>
                  <tr>
                    <td className="py-3">Vercel</td>
                    <td className="py-3">웹 호스팅 및 배포</td>
                  </tr>
                  <tr>
                    <td className="py-3">Google Analytics</td>
                    <td className="py-3">서비스 이용 통계 분석</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">7. 이용자 권리 및 행사 방법</h2>
            <p className="text-gray-300 mb-4">
              사용자는 언제든지 다음 권리를 행사할 수 있습니다:
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">🔍 열람 요구권</h3>
                <p className="text-gray-300 text-sm">
                  본인의 개인정보를 열람하거나 사본을 요청할 수 있습니다.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">✏️ 정정·삭제 요구권</h3>
                <p className="text-gray-300 text-sm">
                  잘못된 정보를 수정하거나 불필요한 정보를 삭제할 수 있습니다.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">🚫 처리 정지 요구권</h3>
                <p className="text-gray-300 text-sm">
                  개인정보 처리를 일시 중지할 수 있습니다 (서비스 이용 제한 가능).
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">🗑️ 회원 탈퇴</h3>
                <p className="text-gray-300 text-sm mb-2">
                  서비스 내 "설정 → 계정 관리 → 회원 탈퇴" 또는 이메일 요청으로 가능합니다.
                </p>
                <p className="text-gray-400 text-xs">
                  * 탈퇴 시 모든 꿈 일기, 생성된 웹툰, 구독 정보가 즉시 삭제됩니다 (복구 불가).
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-4">
              권리 행사 방법: support@dreamics.ai로 이메일 전송 (본인 확인 후 처리)
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">8. 개인정보 보호 조치</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li><strong>암호화:</strong> HTTPS 통신, 데이터베이스 암호화 (AES-256)</li>
              <li><strong>접근 제한:</strong> 최소 권한 원칙, IP 화이트리스트</li>
              <li><strong>정기 점검:</strong> 보안 취약점 스캔, 침입 탐지 시스템</li>
              <li><strong>직원 교육:</strong> 개인정보 보호 의무 교육 실시</li>
              <li><strong>백업:</strong> 자동 백업 및 재해 복구 계획</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">9. 쿠키 사용</h2>
            <p className="text-gray-300 mb-3">
              Dreamics.ai는 다음 목적으로 쿠키를 사용합니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm mb-4">
              <li><strong>필수 쿠키:</strong> 로그인 세션 유지, CSRF 방지</li>
              <li><strong>분석 쿠키:</strong> Google Analytics (트래픽 분석)</li>
              <li><strong>마케팅 쿠키:</strong> 광고 성과 측정 (선택적 동의)</li>
            </ul>
            <p className="text-gray-400 text-sm">
              브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">10. 만 14세 미만 아동 보호</h2>
            <p className="text-gray-300">
              Dreamics.ai는 만 14세 미만 아동의 개인정보를 수집하지 않습니다. 만 14세 미만 사용자가 발견될 경우 즉시 계정 및 관련 정보를 삭제합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">11. 개인정보 보호책임자</h2>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-5">
              <p className="text-gray-300 mb-3">
                개인정보 처리에 관한 문의, 불만, 권리 행사는 아래 담당자에게 연락해주세요:
              </p>
              <div className="bg-black/30 rounded p-4 space-y-2 text-gray-300 text-sm">
                <p><strong>개인정보 보호책임자:</strong> Dreamics.ai 개인정보보호팀</p>
                <p><strong>이메일:</strong> privacy@dreamics.ai (또는 support@dreamics.ai)</p>
                <p><strong>응답 시간:</strong> 영업일 기준 48시간 이내</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">12. 분쟁 해결 및 권익 침해 구제</h2>
            <p className="text-gray-300 mb-3">
              개인정보 침해 관련 분쟁이 발생한 경우 다음 기관에 도움을 요청할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li><strong>개인정보 침해신고센터:</strong> (국번없이) 118 / privacy.kisa.or.kr</li>
              <li><strong>개인정보 분쟁조정위원회:</strong> 1833-6972 / www.kopico.go.kr</li>
              <li><strong>대검찰청 사이버범죄수사단:</strong> 02-3480-3573 / www.spo.go.kr</li>
              <li><strong>경찰청 사이버안전국:</strong> (국번없이) 182 / cyberbureau.police.go.kr</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">13. 고지 의무</h2>
            <p className="text-gray-300">
              본 개인정보 처리방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 사항은 웹사이트 공지 또는 이메일로 최소 7일 전 통지됩니다. 중요한 변경 사항은 30일 전 통지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">14. 시행일</h2>
            <p className="text-gray-300">
              본 개인정보 처리방침은 <strong>2025년 3월 3일</strong>부터 시행됩니다.
            </p>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>개인정보 보호와 관련하여 궁금한 사항은 support@dreamics.ai로 문의해주세요.</p>
        </motion.div>
      </div>
    </div>
  );
}
