import { styled } from 'styled-components';

export const MainTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 3rem;
`;

export const TitlePadding = styled.div`
  padding-bottom: 5rem;
`;

export const SubTitle = styled.p`
  font-size: 1.4rem;
  color: #555557;
  margin-bottom: 1rem;
  line-height: 1.8rem;
`;

export const CheckBox = styled.span<{ $hover: boolean; $active: boolean }>`
  visibility: ${(props) =>
    props.$hover || props.$active ? 'visible' : 'hidden'};
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$active ? 'var( --color-purple)' : 'var(--color-white)'};
  border: 1px solid var(--color-border);
  border-radius: 4px;
  z-index: 10;
  > svg {
    color: var(--color-white);
    font-size: 1.3rem;
  }
  &:hover {
    box-shadow: var(--shadow-primary);
  }
`;
