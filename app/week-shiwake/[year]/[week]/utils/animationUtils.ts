import { defaultDropAnimationSideEffects } from "@dnd-kit/core"

// カスタムドロップアニメーション設定
export const customDropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
  duration: 0, // アニメーション時間を0に設定して即座に適用
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
} 