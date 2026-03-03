import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RefundPolicyPage() {
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
          <h1 className="text-4xl font-bold mb-2">환불 정책</h1>
          <p className="text-gray-400">Refund Policy</p>
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
            <h2 className="text-2xl font-bold mb-4 text-purple-400">1. 환불 정책 개요</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dreamics.ai는 고객 만족을 최우선으로 생각합니다. 본 환불 정책은 Polar.sh 결제 시스템을 통해 처리되는 모든 구독 결제에 적용됩니다.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-200 text-sm flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>중요:</strong> 모든 환불 요청은 Polar 결제 시스템의 정책에 따라 처리되며, 최종 승인은 Polar 및 Dreamics.ai의 검토 후 결정됩니다.
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">2. 환불 가능 기간</h2>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">2.1 신규 구독</h3>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-gray-300 mb-3">
                <strong className="text-green-400">✓ 환불 가능:</strong> 첫 결제일로부터 <strong>7일 이내</strong>
              </p>
              <p className="text-gray-400 text-sm">
                조건: 프리미엄 기능(프리미엄 웹툰 생성, AI 스토리 확장 등)을 3회 이하로 사용한 경우
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">2.2 갱신 결제</h3>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-gray-300 mb-3">
                <strong className="text-green-400">✓ 환불 가능:</strong> 자동 갱신일로부터 <strong>48시간 이내</strong>
              </p>
              <p className="text-gray-400 text-sm">
                조건: 갱신 후 프리미엄 기능을 전혀 사용하지 않은 경우
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">2.3 환불 불가 사유</h3>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-200 mb-3"><strong>✗ 환불 불가:</strong></p>
              <ul className="list-disc list-inside text-red-200/80 space-y-2 text-sm">
                <li>첫 결제일로부터 7일이 경과한 경우</li>
                <li>프리미엄 기능을 4회 이상 사용한 경우</li>
                <li>생성된 웹툰/콘텐츠를 다운로드하거나 외부 공유한 경우</li>
                <li>단순 변심 또는 서비스 미사용을 이유로 한 환불 요청</li>
                <li>구독 기간이 종료된 후의 환불 요청</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">3. 환불 대상 금액</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">전액 환불 (100%)</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                  <li>기술적 오류로 서비스를 정상적으로 이용할 수 없었던 경우</li>
                  <li>중복 결제가 발생한 경우</li>
                  <li>신규 구독 후 7일 이내 + 사용 조건 충족 시</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">부분 환불 (Pro-rata)</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                  <li>서비스 중단이 48시간 이상 지속된 경우 (Dreamics.ai 귀책 사유)</li>
                  <li>약관에 명시되지 않은 특별한 사정이 인정되는 경우 (개별 검토)</li>
                </ul>
                <p className="text-gray-400 text-xs mt-3">
                  * 부분 환불 금액 = (미사용 일수 / 30일) × 월 구독료
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">4. 환불 신청 방법</h2>
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-5">
                <h3 className="font-semibold text-purple-300 mb-3">📧 이메일 신청</h3>
                <p className="text-gray-300 mb-3">다음 정보를 포함하여 이메일을 보내주세요:</p>
                <div className="bg-black/30 rounded p-3 font-mono text-sm text-gray-300 space-y-1">
                  <p><strong>수신:</strong> support@dreamics.ai</p>
                  <p><strong>제목:</strong> [환불 요청] 구독 플랜명 - 이메일 주소</p>
                  <p><strong>내용:</strong></p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-xs">
                    <li>가입 이메일 주소</li>
                    <li>구독 플랜 (PLUS, PRO, ULTRA)</li>
                    <li>결제일 (YYYY-MM-DD)</li>
                    <li>환불 사유 (상세히 작성)</li>
                    <li>Polar 결제 영수증 스크린샷 (선택)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">🔗 Polar 고객 포털</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Polar 결제 시스템을 통해 직접 환불을 요청할 수도 있습니다:
                </p>
                <ol className="list-decimal list-inside text-gray-400 text-sm space-y-1">
                  <li>Polar 구독 관리 페이지 접속</li>
                  <li>"Request Refund" 버튼 클릭</li>
                  <li>환불 사유 작성 후 제출</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">5. 환불 처리 절차</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-1">신청 접수</h3>
                  <p className="text-gray-400 text-sm">환불 요청 이메일 또는 Polar 포털 제출</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-1">검토 및 확인</h3>
                  <p className="text-gray-400 text-sm">
                    영업일 기준 <strong>1-3일</strong> 내 환불 자격 검토 (사용 이력, 결제 정보 확인)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-1">승인/거부 통보</h3>
                  <p className="text-gray-400 text-sm">이메일로 환불 승인 또는 거부 사유 안내</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-1">환불 처리</h3>
                  <p className="text-gray-400 text-sm">
                    승인 후 <strong>5-10 영업일</strong> 내 원 결제 수단으로 환불 (신용카드 취소 또는 계좌 입금)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4 text-yellow-200 text-sm">
              <strong>참고:</strong> 환불 처리 기간은 결제 대행사(Polar) 및 카드사/은행 정책에 따라 달라질 수 있습니다.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">6. 구독 취소 vs 환불</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-300 mb-3">✓ 구독 취소 (언제나 가능)</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• 다음 갱신일부터 요금 청구 중지</li>
                  <li>• 현재 구독 기간은 유지 (예: 3월 15일 취소 → 4월 15일까지 사용 가능)</li>
                  <li>• 환불 없음</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-3">✓ 환불 (조건부 가능)</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• 이미 결제된 금액 반환</li>
                  <li>• 즉시 구독 종료 및 프리미엄 기능 차단</li>
                  <li>• 환불 조건 충족 필요</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">7. 특수 상황</h2>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">7.1 서비스 중단으로 인한 보상</h3>
            <p className="text-gray-300 mb-3">
              Dreamics.ai의 귀책 사유로 서비스가 <strong>연속 48시간 이상</strong> 중단된 경우:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm mb-4">
              <li>중단 시간에 비례한 부분 환불 또는 구독 기간 연장</li>
              <li>사전 공지된 정기 점검은 제외</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-purple-300">7.2 플랜 다운그레이드</h3>
            <p className="text-gray-300 text-sm">
              상위 플랜에서 하위 플랜으로 변경 시 차액 환불은 제공되지 않습니다. 다운그레이드는 다음 갱신일부터 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">8. 분쟁 해결</h2>
            <p className="text-gray-300 mb-3">
              환불 거부 결정에 이의가 있는 경우:
            </p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
              <li>support@dreamics.ai로 재검토 요청 (거부 통지일로부터 14일 이내)</li>
              <li>한국소비자원 분쟁조정 신청 가능</li>
              <li>Polar.sh 고객 지원팀 문의 (결제 관련 분쟁)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">9. 정책 변경</h2>
            <p className="text-gray-300">
              본 환불 정책은 사전 고지 없이 변경될 수 있으며, 변경 사항은 웹사이트 게시일로부터 효력이 발생합니다. 단, 기존 구독자에게 불리한 변경은 최소 30일 전 이메일로 통지됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">10. 연락처</h2>
            <div className="bg-white/5 rounded-lg p-4 space-y-2 text-gray-300">
              <p><strong>환불 문의:</strong> support@dreamics.ai</p>
              <p><strong>응답 시간:</strong> 영업일 기준 24-48시간 이내</p>
              <p><strong>Polar 결제 지원:</strong> <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">polar.sh</a></p>
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
          <p>환불 정책에 대한 질문이 있으시면 언제든지 support@dreamics.ai로 문의해주세요.</p>
        </motion.div>
      </div>
    </div>
  );
}
