import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ChevronRight, X } from "lucide-react";
import AdSense from "@/components/common/AdSense";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  emoji: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "꿈이란 무엇인가? — 뇌과학이 밝히는 수면의 비밀",
    summary: "우리는 왜 꿈을 꾸는 걸까요? 렘(REM) 수면 중 활성화되는 뇌의 메커니즘과 꿈의 역할을 과학적으로 살펴봅니다.",
    content: `꿈은 수면 중, 특히 렘(REM, Rapid Eye Movement) 수면 단계에서 발생하는 생생한 정신적 경험입니다. 뇌과학자들은 수십 년간 꿈의 기능을 연구해왔으며, 다음과 같은 주요 역할을 밝혀냈습니다.

**기억 통합**
하버드 의과대학의 연구에 따르면, 수면 중 뇌는 낮 동안 경험한 정보를 재처리하며 장기 기억으로 통합합니다. 꿈은 이 과정에서 중요한 역할을 합니다.

**감정 처리**
꿈은 낮 동안 경험한 강렬한 감정, 특히 스트레스나 불안을 안전한 환경에서 재경험하게 함으로써 감정적 회복력을 높입니다. 매튜 워커 교수(『우리는 왜 잠을 자야 할까』 저자)는 꿈을 "밤의 치료사"라고 표현합니다.

**창의성 증진**
렘 수면 중 뇌는 서로 관련 없어 보이는 개념들을 연결하는 능력이 높아집니다. 역사 속 많은 발명가와 예술가들이 꿈에서 영감을 얻었다고 알려져 있습니다.

**주의사항:** 꿈 내용이 심리적 우려를 유발한다면 전문 상담사나 정신건강 의학과 의사와 상담하시기 바랍니다. Dreamics.ai의 분석은 엔터테인먼트 목적입니다.`,
    category: "뇌과학",
    readTime: "4분",
    date: "2026-03-01",
    emoji: "🧠",
  },
  {
    id: "2",
    title: "꿈 일기 쓰는 법 — 기억력을 높이는 5가지 팁",
    summary: "깨어난 직후 꿈을 기억하기 어려운 이유와, 꿈 일기를 꾸준히 써서 꿈 기억력을 향상시키는 실용적인 방법을 소개합니다.",
    content: `평균적으로 우리는 꿈에서 깨어나고 5분 이내에 꿈의 50%를 잊어버리고, 10분 후에는 90%를 잊어버립니다. 꿈 일기는 이 망각을 막는 가장 효과적인 방법입니다.

**1. 알람 없이 깨어나기 (가능하다면)**
갑작스러운 알람 소리는 꿈의 기억을 방해합니다. 자연스럽게 깨어날 수 있도록 수면 시간을 조절해보세요.

**2. 눈을 뜨기 전 잠시 멈추기**
깨어나자마자 몸을 움직이면 꿈의 기억이 빠르게 사라집니다. 눈을 뜨기 전 30초간 꿈의 장면을 머릿속으로 재생해보세요.

**3. 즉시 기록하기**
침대 옆에 노트와 펜을 두거나 스마트폰 앱(예: Dreamics.ai)을 활용하여 깨어나는 즉시 기록하세요. 완벽한 문장이 아니어도 됩니다. 핵심 장면, 감정, 색깔만 메모해도 충분합니다.

**4. 감정을 먼저 기록하기**
꿈의 내용보다 감정이 더 오래 기억에 남습니다. "무서웠다", "행복했다" 같은 감정 키워드를 먼저 적은 후 장면을 재구성해보세요.

**5. 꾸준함이 핵심**
꿈 일기는 근육과 같습니다. 매일 쓸수록 꿈 기억력이 향상됩니다. 2-4주 후에는 훨씬 더 생생하고 긴 꿈을 기억할 수 있게 됩니다.`,
    category: "실용 가이드",
    readTime: "3분",
    date: "2026-03-03",
    emoji: "📔",
  },
  {
    id: "3",
    title: "꿈 속 감정의 의미 — 기쁨, 불안, 슬픔이 말하는 것",
    summary: "꿈에서 자주 경험하는 6가지 핵심 감정(기쁨, 불안, 분노, 슬픔, 놀람, 평온)이 우리의 내면 상태와 어떻게 연결되는지 살펴봅니다.",
    content: `꿈에서 경험하는 감정은 단순한 환상이 아닙니다. 뇌과학 연구에 따르면 꿈의 감정은 실제 감정과 동일한 신경 회로를 활성화합니다.

**기쁨 (Joy)**
꿈에서 기쁨을 자주 경험한다면 현재 삶에 대한 만족도가 높거나, 뇌가 긍정적인 기억을 강화하고 있는 신호일 수 있습니다.

**불안 (Anxiety)**
불안한 꿈, 특히 쫓기거나 시험에 늦는 꿈은 매우 흔합니다. 이는 뇌가 스트레스 상황에 대비하는 연습을 하는 것으로 해석될 수 있습니다.

**분노 (Anger)**
꿈에서 분노를 자주 느낀다면 현실에서 억눌린 감정이 있을 가능성이 있습니다. 꿈은 안전한 공간에서 이 감정을 처리합니다.

**슬픔 (Sadness)**
상실이나 이별에 관한 슬픈 꿈은 애도 과정의 일부입니다. 뇌가 감정적 상처를 치유하는 방식입니다.

**놀람 (Surprise)**
놀라운 꿈은 뇌가 예상치 못한 상황에 대한 인지적 유연성을 훈련하는 것과 관련이 있습니다.

**평온 (Peace)**
평온한 꿈은 전반적인 정신 건강과 긍정적인 관련이 있습니다.

**중요:** 위 설명은 일반적인 심리학적 관점이며, 개인의 상황에 따라 다를 수 있습니다. 꿈이 지속적으로 심리적 불편함을 유발한다면 전문가와 상담하시기 바랍니다.`,
    category: "꿈 심리학",
    readTime: "5분",
    date: "2026-03-05",
    emoji: "💭",
  },
  {
    id: "4",
    title: "반복되는 악몽 — 원인과 대처 방법",
    summary: "같은 악몽이 반복되는 이유와, 이를 극복하기 위한 이미지 리허설 요법(IRT) 등 과학적으로 검증된 방법을 소개합니다.",
    content: `반복되는 악몽은 성인의 약 5-8%가 경험하며, 외상 후 스트레스 장애(PTSD)와 관련이 깊습니다.

**반복 악몽의 주요 원인**
- 처리되지 않은 외상 경험
- 만성적인 스트레스와 불안
- 수면 부족 또는 수면 무호흡증
- 특정 약물의 부작용

**이미지 리허설 요법 (Image Rehearsal Therapy, IRT)**
IRT는 반복 악몽 치료에 가장 효과적인 방법 중 하나입니다.
1. 악몽의 내용을 글로 적습니다
2. 결말을 원하는 방향으로 새롭게 씁니다 (긍정적으로 변경)
3. 새로운 결말을 잠들기 전 머릿속으로 10-20분간 상상합니다
4. 2-3주 후 악몽의 빈도가 감소합니다

**수면 위생 개선**
- 규칙적인 수면 시간 유지
- 취침 전 카페인, 알코올 피하기
- 수면 환경 최적화 (어둠, 시원한 온도)

**전문가 도움이 필요한 경우**
악몽이 주 3회 이상 지속되거나 일상생활에 영향을 준다면 수면 전문의 또는 정신건강 의학과 전문의와 상담하시기 바랍니다.

**면책 고지:** Dreamics.ai는 의료 서비스가 아닙니다. 위 정보는 교육 목적으로 제공됩니다.`,
    category: "수면 건강",
    readTime: "6분",
    date: "2026-03-06",
    emoji: "🌙",
  },
  {
    id: "5",
    title: "루시드 드림(자각몽) 입문 — 꿈을 컨트롤하는 방법",
    summary: "자각몽이란 무엇이며, 실제로 꿈 속에서 의식을 유지하고 꿈을 통제하는 방법을 단계별로 안내합니다.",
    content: `자각몽(Lucid Dream)은 꿈을 꾸면서 자신이 꿈을 꾸고 있음을 인식하는 상태입니다. 일부 숙련된 자각몽 경험자는 꿈의 내용을 자유롭게 조종할 수 있습니다.

**자각몽의 과학**
스탠포드 대학의 스티브 라버지 박사는 1980년대에 자각몽이 실제 뇌 현상임을 과학적으로 증명했습니다. 자각몽 중에는 전전두엽(의식적 사고를 담당)이 활성화됩니다.

**현실 테스트 (Reality Testing)**
하루에 여러 번 "지금 내가 꿈을 꾸고 있나?"라고 자문하며 손가락을 확인하세요. 꿈 속에서는 손가락이 비정상적으로 보이거나 수가 달라 보일 수 있습니다. 이 습관이 꿈 속으로 이어지면 자각몽이 시작됩니다.

**MILD 기법 (Mnemonic Induction of Lucid Dreams)**
1. 잠들기 전 "오늘 밤 꿈을 꾸고 있음을 알아차리겠다"고 의도를 설정합니다
2. 이전에 꾼 꿈을 떠올리며 그 안에서 자각몽 상태에 진입하는 장면을 상상합니다
3. 반복적으로 이 과정을 수행합니다

**WILD 기법 (Wake Initiated Lucid Dream)**
5-6시간 수면 후 20-30분 동안 깨어있다가 다시 잠들면 렘 수면에 빠르게 진입할 수 있으며, 이때 의식을 유지하면 자각몽에 진입할 수 있습니다.

**주의:** 자각몽 시도가 수면 품질 저하로 이어진다면 중단하시기 바랍니다.`,
    category: "자각몽",
    readTime: "7분",
    date: "2026-03-07",
    emoji: "✨",
  },
  {
    id: "6",
    title: "꿈과 창의성 — 역사 속 꿈에서 탄생한 발명과 예술",
    summary: "비틀즈의 'Yesterday', 구글의 탄생 아이디어, 벤젠 구조의 발견 등 꿈이 인류 역사에 미친 놀라운 영향을 소개합니다.",
    content: `꿈은 인류 역사상 가장 강력한 창의적 영감의 원천 중 하나였습니다.

**폴 매카트니와 'Yesterday'**
비틀즈의 폴 매카트니는 1965년 어느 날 아침, 꿈에서 들은 멜로디를 잠에서 깬 직후 피아노로 연주했습니다. 그것이 바로 역사상 가장 많이 커버된 노래 'Yesterday'의 탄생 순간이었습니다.

**구글의 탄생 아이디어**
래리 페이지는 23살 때 꿈에서 "전체 웹을 다운로드하여 링크만 유지하면 어떨까?"라는 아이디어를 얻었다고 밝혔습니다. 이 꿈이 구글 검색 엔진의 핵심 알고리즘인 PageRank의 씨앗이 되었습니다.

**벤젠 구조의 발견**
화학자 아우구스트 케쿨레는 1865년 뱀이 자신의 꼬리를 물고 있는 꿈을 꾸고 벤젠의 환형 구조를 발견했습니다. 이는 현대 유기화학의 토대가 되었습니다.

**메리 셸리와 프랑켄슈타인**
19세의 메리 셸리는 악몽에서 인공적으로 생명을 만드는 과학자의 이미지를 보고 『프랑켄슈타인』을 썼습니다.

**왜 꿈은 창의적인가?**
렘 수면 중 뇌는 논리적 검열 기능이 약해지고, 연관성이 낮은 개념들 사이의 연결이 활발해집니다. 이 상태에서 낮에는 떠올리지 못했던 혁신적 아이디어가 탄생합니다.

Dreamics.ai로 당신의 꿈을 기록하고, 그 안에 숨겨진 창의적 씨앗을 발견해보세요.`,
    category: "꿈과 창의성",
    readTime: "5분",
    date: "2026-03-08",
    emoji: "🎨",
  },
];

const CATEGORIES = ["전체", "뇌과학", "실용 가이드", "꿈 심리학", "수면 건강", "자각몽", "꿈과 창의성"];

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filtered = selectedCategory === "전체"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-full pt-20 pb-24 px-5 xl:pt-28 xl:px-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <BookOpen className="text-purple-400 w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">꿈 심리학 가이드</h1>
          </div>
          <p className="text-gray-400 text-sm">
            꿈과 수면에 관한 과학적 지식과 실용적인 팁을 공유합니다
          </p>
          <p className="text-xs text-gray-500 mt-1">
            * 본 콘텐츠는 교육·엔터테인먼트 목적이며 의료적 조언을 대체하지 않습니다.
          </p>
        </motion.div>

        {/* 상단 광고 */}
        {/* TODO: AdSense 승인 후 실제 광고 슬롯 ID로 교체하세요 */}
        <div className="mb-8">
          <AdSense adSlot="4567890123" adFormat="horizontal" className="w-full" />
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Post Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filtered.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPost(post)}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-purple-500/30 transition-all group"
            >
              <div className="text-3xl mb-3">{post.emoji}</div>
              <span className="text-xs text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded-full">
                {post.category}
              </span>
              <h2 className="text-lg font-bold text-white mt-3 mb-2 leading-tight group-hover:text-purple-300 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{post.summary}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime} 읽기</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400 group-hover:gap-2 transition-all">
                  <span>읽기</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* 하단 광고 */}
        {/* TODO: AdSense 승인 후 실제 광고 슬롯 ID로 교체하세요 */}
        <div className="mt-10">
          <AdSense adSlot="5678901234" adFormat="rectangle" className="w-full" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center bg-purple-500/10 border border-purple-500/30 rounded-2xl p-8"
        >
          <p className="text-white font-semibold text-lg mb-2">당신의 꿈을 기록해보세요</p>
          <p className="text-gray-400 text-sm mb-4">
            Dreamics.ai로 꿈을 웹툰으로 변환하고 감정을 분석해보세요.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
          >
            꿈 기록 시작하기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* 포스트 상세 모달 */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-[#1A1638] border border-white/10 rounded-2xl max-w-2xl w-full p-8 relative"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-4xl mb-4">{selectedPost.emoji}</div>
              <span className="text-xs text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded-full">
                {selectedPost.category}
              </span>
              <h2 className="text-2xl font-bold text-white mt-4 mb-2">{selectedPost.title}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedPost.readTime} 읽기</span>
                </div>
                <span>{selectedPost.date}</span>
              </div>

              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm space-y-3">
                {selectedPost.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* 모달 내 광고 */}
              {/* TODO: AdSense 승인 후 실제 광고 슬롯 ID로 교체하세요 */}
              <div className="mt-8">
                <AdSense adSlot="6789012345" adFormat="rectangle" className="w-full" />
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  ※ 본 콘텐츠는 교육·엔터테인먼트 목적이며, 의료적 조언이나 심리 치료를 대체하지 않습니다.
                  심리적 어려움이 있으시다면 전문가와 상담하시기 바랍니다.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
