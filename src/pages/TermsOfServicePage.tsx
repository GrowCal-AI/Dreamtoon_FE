import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold mb-2">서비스 이용약관</h1>
          <p className="text-gray-400">최종 업데이트: 2026년 3월 4일</p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제1조 (목적)</h2>
            <p className="text-gray-300 leading-relaxed">
              본 약관은 Dreamics.ai(이하 "회사")가 제공하는 AI 꿈 분석 및 웹툰 생성 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제2조 (정의)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><strong>"서비스"</strong>란 회사가 제공하는 AI 기반 꿈 분석, 웹툰 생성, 감정 분석, 꿈 일기, AI 상담 등의 모든 서비스를 의미합니다.</li>
              <li><strong>"이용자"</strong>란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li><strong>"회원"</strong>이란 회사와 서비스 이용계약을 체결하고 아이디(ID)를 부여받은 자를 말합니다.</li>
              <li><strong>"콘텐츠"</strong>란 이용자가 생성한 꿈 일기, 웹툰, AI 대화 기록 등을 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제3조 (약관의 효력 및 변경)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</p>
              <p>2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 약관이 변경되는 경우 변경사항을 서비스 내 공지사항을 통해 공지합니다.</p>
              <p>3. 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제4조 (서비스의 제공 및 변경)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>AI 기반 꿈 분석 및 감정 태그 서비스</li>
                <li>꿈 내용을 4컷 웹툰으로 생성하는 서비스</li>
                <li>꿈 일기 작성 및 관리 서비스</li>
                <li>AI 스토리 확장 서비스</li>
                <li>꿈 라이브러리 및 통계 서비스</li>
                <li>유료 구독 서비스 (프리미엄 스타일, 고급 AI 기능)</li>
              </ul>
              <p>2. 회사는 서비스의 내용을 변경할 수 있으며, 변경 사항은 사전에 공지합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제5조 (서비스 이용계약의 성립)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 이용계약은 이용자가 본 약관에 동의하고 회원가입을 완료함으로써 성립됩니다.</p>
              <p>2. 회사는 다음 각 호에 해당하는 경우 승낙하지 않을 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                <li>부정한 용도 또는 영리를 추구할 목적으로 서비스를 이용하고자 하는 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제6조 (회원 정보의 변경)</h2>
            <p className="text-gray-300 leading-relaxed">
              회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 회원은 회원가입 시 기재한 사항이 변경되었을 경우 온라인으로 수정하거나 이메일 등으로 회사에 변경사항을 알려야 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제7조 (개인정보보호 의무)</h2>
            <p className="text-gray-300 leading-relaxed">
              회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제8조 (이용자의 의무)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>신청 또는 변경 시 허위내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                <li>서비스를 상업적 목적으로 무단 이용하는 행위</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제9조 (서비스 이용 제한)</h2>
            <div className="space-y-4 text-gray-300">
              <p>회사는 이용자가 다음 각 호에 해당하는 경우 사전 통지 없이 이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>타인의 명의를 사용하여 신청한 경우</li>
                <li>서비스 운영을 고의로 방해한 경우</li>
                <li>공공질서 및 미풍양속에 저해되는 내용을 유포한 경우</li>
                <li>타인의 명예를 손상시키거나 불이익을 주는 행위를 한 경우</li>
                <li>회사가 제공하는 서비스의 원활한 진행을 방해하는 행위를 하거나 시도한 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제10조 (저작권의 귀속 및 이용제한)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 회사가 제공하는 서비스, 그에 필요한 소프트웨어, 이미지, 마크, 로고, 디자인, 서비스명칭, 정보 및 상표 등과 관련된 지적재산권 및 기타 권리는 회사에 소유권이 있습니다.</p>
              <p>2. 이용자가 서비스를 이용하여 생성한 콘텐츠(꿈 일기, 웹툰 등)의 저작권은 이용자에게 있습니다.</p>
              <p>3. 회사는 이용자가 생성한 콘텐츠를 서비스 제공, 개선, 홍보 목적으로 사용할 수 있으며, 이용자는 회원가입 시 이에 동의한 것으로 간주됩니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제11조 (유료 서비스)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 회사는 유료 구독 서비스를 제공할 수 있으며, 가격, 결제 방법 등은 서비스 내에서 안내합니다.</p>
              <p>2. 유료 서비스의 이용요금은 회사가 정한 바에 따르며, 변경 시 사전 공지합니다.</p>
              <p>3. 결제 완료 후에는 환불이 제한될 수 있으며, 환불 정책은 관련 법령 및 회사의 정책을 따릅니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제12조 (광고 게재 및 제3자와의 거래)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 회사는 서비스의 운영과 관련하여 서비스 화면, 이메일 등에 광고를 게재할 수 있습니다.</p>
              <p>2. 회사는 Google AdSense를 통해 제3자 광고를 게재하며, 이용자는 광고 게재에 동의한 것으로 간주됩니다.</p>
              <p>3. 광고를 통한 제3자와의 거래는 이용자와 제3자 간에 이루어지며, 회사는 이에 대해 책임을 지지 않습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제13조 (면책조항)</h2>
            <div className="space-y-4 text-gray-300">
              <p>1. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
              <p>2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</p>
              <p>3. 회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</p>
              <p>4. AI가 생성한 콘텐츠(꿈 분석, 웹툰, 상담 내용 등)는 참고 목적이며, 회사는 그 정확성, 완전성, 유용성에 대해 보증하지 않습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">제14조 (분쟁 해결)</h2>
            <p className="text-gray-300 leading-relaxed">
              본 약관은 대한민국 법률에 따라 규율되고 해석됩니다. 서비스 이용과 관련하여 회사와 이용자 간에 분쟁이 발생한 경우, 양 당사자는 성실히 협의하여 해결하도록 노력하며, 협의가 이루어지지 않을 경우 관할법원은 민사소송법에 따른 관할법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">부칙</h2>
            <p className="text-gray-300 leading-relaxed">
              본 약관은 2026년 3월 4일부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
