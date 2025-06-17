import { PAGE_TITLE_RULES } from "../styles/siteStyle";

interface Props {
  pathname: string;
  zDataManagement: boolean;
  fileManagement: boolean;
}

export function HeaderCenterTitle({ pathname, zDataManagement, fileManagement }: Props) {
  // 条件に一致する最初のルールを探す
  const matchedRule = PAGE_TITLE_RULES.find(rule => {
    if (rule.condition.length === 3) {
      return rule.condition(pathname, zDataManagement, fileManagement);
    } else if (rule.condition.length === 2) {
      return rule.condition(pathname, zDataManagement);
    } else {
      return rule.condition(pathname);
    }
  });

  // ルールが見つかった場合は、そのルールに従ってタイトルを表示
  if (matchedRule) {
    return <span className={matchedRule.style}>{matchedRule.title}</span>;
  }

  return null;
} 