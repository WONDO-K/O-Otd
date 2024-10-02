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
});

// 컴포넌트 내보내기
export { TitleText, TitleBoldText, FooterText };
