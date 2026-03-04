import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0C29] via-[#1a1440] to-[#24183f] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로 가기</span>
          </button>
          <h1 className="text-3xl font-bold mb-2">개인정보 처리방침</h1>
          <p className="text-gray-400">최종 업데이트: 2026년 3월 4일</p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dreamics.ai(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리된 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할 것입니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
              <li>서비스 제공: 꿈 분석, 웹툰 생성, AI 상담, 감정 분석 등 서비스 제공</li>
              <li>마케팅 및 광고: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공</li>
              <li>광고 서비스: Google AdSense를 통한 맞춤형 광고 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. 수집하는 개인정보의 항목</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-purple-200">필수 수집 항목</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>이메일 주소</li>
                  <li>닉네임</li>
                  <li>프로필 사진 (선택)</li>
                  <li>소셜 로그인 정보 (카카오, 구글, 네이버)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-purple-200">자동 수집 항목</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>서비스 이용 기록</li>
                  <li>접속 로그, 쿠키</li>
                  <li>기기 정보 (OS, 브라우저 종류)</li>
                  <li>IP 주소</li>
                  <li>광고 식별자 (Google AdSense 쿠키)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-purple-200">서비스 이용 과정에서 생성되는 정보</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>꿈 일기 내용</li>
                  <li>감정 분석 데이터</li>
                  <li>생성된 웹툰 이미지</li>
                  <li>AI 대화 기록</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. 개인정보의 보유 및 이용기간</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
              <li><strong>서비스 이용 기록:</strong> 회원 탈퇴 후 30일</li>
              <li><strong>전자상거래 관련 기록:</strong> 5년 (전자상거래법)</li>
              <li><strong>소비자 불만 또는 분쟁처리 기록:</strong> 3년 (전자상거래법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
            </p>
            <div className="bg-purple-900/20 p-4 rounded-lg space-y-2 text-gray-300">
              <div>
                <p className="font-semibold text-purple-200">Google AdSense</p>
                <ul className="list-disc list-inside ml-4 text-sm mt-1">
                  <li>제공 목적: 맞춤형 광고 제공</li>
                  <li>제공 항목: 쿠키, 광고 식별자, 방문 기록</li>
                  <li>보유 기간: Google 개인정보 처리방침에 따름</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. 쿠키(Cookie) 및 광고 추적</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              회사는 서비스 개선 및 맞춤형 광고 제공을 위해 쿠키를 사용합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>쿠키란? 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주 작은 텍스트 파일로 귀하의 컴퓨터 하드디스크에 저장됩니다.</li>
              <li><strong>Google AdSense 쿠키:</strong> Google은 쿠키를 사용하여 관심사 기반 광고를 게재합니다.</li>
              <li><strong>쿠키 거부 방법:</strong> 브라우저 설정에서 쿠키 차단 가능 (단, 서비스 이용에 제한이 있을 수 있음)</li>
              <li><strong>광고 맞춤설정 해제:</strong> <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google 광고 설정</a>에서 개인화 광고를 끌 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              권리 행사는 서비스 내 설정 메뉴 또는 support@dreamics.ai로 요청하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. 개인정보의 파기</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><strong>파기 절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 파기됩니다.</li>
              <li><strong>파기 방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">8. 개인정보 보호책임자</h2>
            <div className="bg-purple-900/20 p-4 rounded-lg text-gray-300">
              <p className="mb-2"><strong className="text-purple-200">개인정보 보호책임자</strong></p>
              <ul className="space-y-1 ml-4">
                <li>이메일: support@dreamics.ai</li>
                <li>연락처: 문의사항이 있으시면 이메일로 연락 주시기 바랍니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">9. 개인정보 처리방침 변경</h2>
            <p className="text-gray-300 leading-relaxed">
              이 개인정보 처리방침은 2026년 3월 4일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">10. Google AdSense 관련 추가 고지</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              본 웹사이트는 Google AdSense를 사용하여 광고를 게재합니다. Google은 귀하의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Google의 광고 개인 최적화 설정은 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google 광고 설정</a>에서 관리할 수 있습니다.</li>
              <li>Google AdSense의 개인정보 보호정책은 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google 개인정보처리방침</a>에서 확인하실 수 있습니다.</li>
              <li>제3자 공급업체는 쿠키를 사용하여 이 웹사이트 및 다른 웹사이트에서의 귀하의 이전 방문 기록을 기반으로 광고를 게재합니다.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
