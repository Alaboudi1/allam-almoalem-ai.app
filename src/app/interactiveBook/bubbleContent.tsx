import Explain from '@/components/interactive/math/explain';
import PickTeachingMethods from '@/components/interactive/math/main';
import Solve from '@/components/interactive/math/solve';
import Wait from '@/components/Wait';
import React from 'react';

interface BubbleContentProps {
  text: string;
  onClick: (id: string | FormData) => Promise<void> | FormData;
  category: string;
}



const BubbleContent: React.FC<BubbleContentProps> = ({ text, onClick, category }) => {

  if (category === "QuestionExplain") return <PickTeachingMethods onClick={onClick} options={["حل تفاعلي", "اشرح لي"]} />;
  if (category === "ExplainOnly") return <PickTeachingMethods onClick={onClick} options={["اشرح لي"]} />;
  if (category === "solve") return <Solve text={text} onClick={onClick} />;
  if (category === "explain") return <Explain text={text} />;
  if (category === "wait") return <Wait />;
  return <div>{text}</div>;
};

export default BubbleContent;
