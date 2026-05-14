export function ChaleaMarkdownSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-[#e4e4e7] rounded-[2px]" />
        <div className="h-3 w-full bg-[#ebebee] rounded-[2px]" />
        <div className="h-3 w-[92%] bg-[#ebebee] rounded-[2px]" />
        <div className="h-3 w-[78%] bg-[#ebebee] rounded-[2px]" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-40 bg-[#e4e4e7] rounded-[2px]" />
        <div className="h-3 w-full bg-[#ebebee] rounded-[2px]" />
        <div className="h-3 w-[85%] bg-[#ebebee] rounded-[2px]" />
      </div>

      <div className="h-24 w-full bg-[#0c0c10]/90 rounded-[4px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_1.6s_infinite]" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-[88%] bg-[#ebebee] rounded-[2px]" />
        <div className="h-3 w-[72%] bg-[#ebebee] rounded-[2px]" />
        <div className="h-3 w-[60%] bg-[#ebebee] rounded-[2px]" />
      </div>
    </div>
  )
}
