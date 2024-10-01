package com.threeheads.battle.common.quartz;



import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.spi.JobFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Quartz Scheduler 설정 클래스
 */
@Configuration
public class QuartzConfig {

    private static final Logger logger = LoggerFactory.getLogger(QuartzConfig.class);

    @Autowired
    private ApplicationContext applicationContext;

    /**
     * 스프링의 ApplicationContext를 사용하여 Quartz Job을 스프링 빈으로 생성할 수 있는 커스텀 JobFactory 정의
     * @return JobFactory
     */
    @Bean
    public JobFactory jobFactory() {
        AutowiringSpringBeanJobFactory jobFactory = new AutowiringSpringBeanJobFactory();
        jobFactory.setApplicationContext(applicationContext);
        return jobFactory;
    }

    /**
     * Quartz Scheduler Factory Bean 설정
     * @return SchedulerFactoryBean
     * @throws SchedulerException
     */
    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(JobFactory jobFactory) throws SchedulerException {
        SchedulerFactoryBean factory = new SchedulerFactoryBean();
        factory.setJobFactory(jobFactory);
        factory.setOverwriteExistingJobs(true);
        logger.info("Quartz Scheduler Factory Bean이 초기화되었습니다.");
        return factory;
    }

    /**
     * Scheduler 빈 설정 및 시작
     * @param factory SchedulerFactoryBean
     * @return Scheduler
     * @throws SchedulerException
     */
    @Bean
    public Scheduler scheduler(SchedulerFactoryBean factory) throws SchedulerException {
        Scheduler scheduler = factory.getScheduler();
        scheduler.start();
        logger.info("Quartz Scheduler가 시작되었습니다.");
        return scheduler;
    }
}
