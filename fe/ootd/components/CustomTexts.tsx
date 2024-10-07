// components/CustomTexts.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

// TitleText 컴포넌트
interface TitleTextProps extends TextProps {
  children: React.ReactNode;
}

const TitleText: React.FC<TitleTextProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
};

// TitleBoldText 컴포넌트
interface TitleBoldTextProps extends TextProps {
  children: React.ReactNode;
}

const TitleBoldText: React.FC<TitleBoldTextProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.titleBold, style]} {...props}>
      {children}
    </Text>
  );
};

// FooterText 컴포넌트
interface FooterTextProps extends TextProps {
  children: React.ReactNode;
}

const FooterText: React.FC<FooterTextProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.footer, style]} {...props}>
      {children}
    </Text>
  );
};

// ContentText 컴포넌트
interface ContentTextProps extends TextProps {
  children: React.ReactNode;
}

const ContentText: React.FC<ContentTextProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.content, style]} {...props}>
      {children}
    </Text>
  );
};

// ContentBoldText 컴포넌트
interface ContentBoldTextProps extends TextProps {
  children: React.ReactNode;
}

const ContentBoldText: React.FC<ContentBoldTextProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.contentBold, style]} {...props}>
      {children}
    </Text>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  title: {
    fontFamily: 'LeferiPointWhiteOblique',
  },
  titleBold: {
    fontFamily: 'LeferiPointBlackOblique',
  },
  footer: {
    fontFamily: 'NanumGothicExtraBold',
  },
  content: {
    fontFamily: 'Pretendard-Regular',
  },
  contentBold: {
    fontFamily: 'Pretendard-Bold',
  },
});

// 컴포넌트 내보내기
export { TitleText, TitleBoldText, FooterText, ContentText, ContentBoldText };
