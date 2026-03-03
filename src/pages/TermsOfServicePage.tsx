import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold mb-2">서비스 이용약관</h1>
          <p className="text-gray-400">Terms of Service</p>
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
            <h2 className="text-2xl font-bold mb-4 text-purple-400">1. 서비스 개요</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dreamics.ai("서비스")는 AI 기반 꿈 스토리텔링 및 웹툰 생성 플랫폼입니다. 본 서비스는 순수하게 **엔터테인먼트 및 창작 목적**으로 제공되며, 의료, 심리 치료, 건강 진단, 또는 전문적인 상담 서비스를 대체하지 않습니다.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200 text-sm">
              <strong>중요:</strong> 본 서비스는 꿈을 창작 스토리와 예술 작품으로 변환하는 오락 서비스입니다. 심리적 문제나 건강 문제가 있는 경우 반드시 전문 의료진과 상담하시기 바랍니다.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">2. 서비스 이용 자격</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>만 14세 이상의 개인 사용자</li>
              <li>유효한 이메일 주소 또는 소셜 로그인 계정 보유자 (카카오)</li>
              <li>대한민국 법률 및 본 약관을 준수할 의사가 있는 자</li>
              <li>만 14세 미만의 경우 법정대리인의 동의 필요</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">3. 구독 및 결제</h2>
            <h3 className="text-xl font-semibold mb-3 text-purple-300">3.1 구독 플랜</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li><strong>FREE (무료):</strong> 기본 기능 제공 (월 1회 스탠다드 웹툰, 1회 감정 태그 등)</li>
              <li><strong>PLUS ($1.50/월):</strong> 월 5회 스탠다드 웹툰, 1회 프리미엄 웹툰</li>
              <li><strong>PRO ($6.50/월):</strong> 월 20회 스탠다드 웹툰, 5회 프리미엄 웹툰, 무제한 감정 태그</li>
              <li><strong>ULTRA ($13.50/월):</strong> 무제한 스탠다드 웹툰, 월 20회 프리미엄 웹툰, 모든 프리미엄 기능</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">3.2 결제 처리</h3>
            <p className="text-gray-300 mb-4">
              모든 결제는 **Polar.sh**를 통해 안전하게 처리됩니다. Polar의 결제 약관 및 개인정보 처리방침이 적용됩니다. 결제는 USD로 처리되며, 환율 변동에 따라 원화 금액이 달라질 수 있습니다.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">3.3 자동 갱신</h3>
            <p className="text-gray-300">
              유료 구독은 매월 자동으로 갱신됩니다. 구독 취소는 다음 갱신일 24시간 전까지 가능하며, Polar 고객 포털에서 직접 관리할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">4. 사용자 콘텐츠</h2>
            <h3 className="text-xl font-semibold mb-3 text-purple-300">4.1 콘텐츠 소유권</h3>
            <p className="text-gray-300 mb-4">
              사용자가 입력한 꿈 일기 텍스트는 사용자의 소유입니다. AI가 생성한 웹툰 이미지 및 스토리 확장 콘텐츠에 대한 소유권은 사용자에게 부여되며, 개인적/비상업적 용도로 자유롭게 사용할 수 있습니다.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">4.2 콘텐츠 사용 권한</h3>
            <p className="text-gray-300">
              사용자는 Dreamics.ai에 다음 권한을 부여합니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>AI 모델 학습 및 서비스 개선 목적으로 익명화된 데이터 사용</li>
              <li>마케팅 및 프로모션 목적으로 사용자가 명시적으로 공유한 콘텐츠 사용 (사전 동의 필요)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">5. 금지 행위</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>불법적이거나 유해한 콘텐츠 생성 (폭력, 음란물, 차별, 혐오 발언 등)</li>
              <li>타인의 개인정보를 무단으로 수집하거나 공유하는 행위</li>
              <li>서비스의 보안 시스템을 우회하거나 해킹 시도</li>
              <li>자동화 스크립트(봇)를 사용한 대량 콘텐츠 생성</li>
              <li>생성된 콘텐츠를 상업적 목적으로 재판매하는 행위</li>
              <li>의료/심리 진단 목적으로 서비스를 오용하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">6. 서비스 제공 및 중단</h2>
            <p className="text-gray-300 mb-4">
              Dreamics.ai는 서비스의 안정성과 품질을 위해 최선을 다하지만, 다음의 경우 서비스가 일시 중단될 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>정기 점검 및 시스템 유지보수 (사전 공지)</li>
              <li>천재지변, 전쟁, 파업 등 불가항력적 사유</li>
              <li>제3자 서비스 (Polar, AI API 등) 장애</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">7. 면책 조항</h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-200 space-y-3">
              <p className="font-semibold">본 서비스는 "있는 그대로(AS-IS)" 제공됩니다:</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>AI 생성 콘텐츠의 정확성, 적합성, 완전성을 보장하지 않습니다</li>
                <li>꿈 해석, 감정 태그 등은 엔터테인먼트 목적이며 과학적/의학적 근거가 없습니다</li>
                <li>서비스 이용으로 인한 정신적, 감정적 영향에 대해 책임지지 않습니다</li>
                <li>생성된 콘텐츠가 저작권을 침해하지 않음을 보장하지 않습니다</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">8. 책임의 제한</h2>
            <p className="text-gray-300">
              Dreamics.ai의 손해배상 책임은 법률이 허용하는 범위 내에서 다음으로 제한됩니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3">
              <li>직접 손해: 사용자가 지불한 구독료의 최근 3개월치 금액</li>
              <li>간접 손해, 특별 손해, 징벌적 손해에 대해서는 책임지지 않음</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">9. 개인정보 보호</h2>
            <p className="text-gray-300">
              개인정보 수집 및 처리는 별도의 <a href="/privacy-policy" className="text-purple-400 hover:underline">개인정보 처리방침</a>에 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">10. 약관 변경</h2>
            <p className="text-gray-300">
              Dreamics.ai는 필요 시 본 약관을 변경할 수 있으며, 변경 사항은 웹사이트 공지 또는 이메일로 최소 7일 전 통지됩니다. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">11. 준거법 및 관할</h2>
            <p className="text-gray-300">
              본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 서울중앙지방법원을 전속 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">12. 연락처</h2>
            <div className="bg-white/5 rounded-lg p-4 space-y-2 text-gray-300">
              <p><strong>서비스명:</strong> Dreamics.ai</p>
              <p><strong>이메일:</strong> support@dreamics.ai</p>
              <p><strong>웹사이트:</strong> https://dreamics.ai</p>
            </div>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>본 약관에 동의함으로써 귀하는 Dreamics.ai의 모든 정책을 이해하고 수락한 것으로 간주됩니다.</p>
        </motion.div>
      </div>
    </div>
  );
}
