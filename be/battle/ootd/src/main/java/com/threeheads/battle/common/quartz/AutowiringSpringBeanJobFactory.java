package com.threeheads.battle.common.quartz;

import org.quartz.spi.TriggerFiredBundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

/**
 * 스프링의 ApplicationContext를 사용하여 Quartz Job을 스프링 빈으로 생성할 수 있는 커스텀 JobFactory
 */
public class AutowiringSpringBeanJobFactory extends SpringBeanJobFactory {

    private AutowireCapableBeanFactory beanFactory;
    Logger log = LoggerFactory.getLogger(AutowiringSpringBeanJobFactory.class);


    /**
     * ApplicationContext를 설정하여 스프링 빈의 의존성을 주입할 수 있도록 함
     * @param context ApplicationContext
     */
    public void setApplicationContext(ApplicationContext context) {
        this.beanFactory = context.getAutowireCapableBeanFactory();
    }

    /**
     * Quartz Job 인스턴스를 생성할 때 스프링 빈의 의존성을 주입함
     * @param bundle TriggerFiredBundle
     * @return 생성된 Job 인스턴스
     * @throws Exception
     */
    @Override
    protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
        Object jobInstance = super.createJobInstance(bundle);
        beanFactory.autowireBean(jobInstance); // 의존성 주입
        return jobInstance;
    }
}