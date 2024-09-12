pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BE = "ohuggy/ootd-be" // Docker 이미지 이름 설정
        ANDROID_HOME = "/opt/android-sdk"
        PATH = "${env.ANDROID_HOME}/cmdline-tools/latest/bin:${env.ANDROID_HOME}/platform-tools:${env.PATH}"
    }

    stages {
        stage("CI: Checkout") {
            steps {
                git branch: 'master',
                    url: 'https://lab.ssafy.com/s11-bigdata-dist-sub1/S11P21E104.git',
                    credentialsId: "ootd"
            }
        }

        stage('Install Dependencies for FE') {
            steps {
                dir("fe/ootd"){
                    // 프로젝트의 dependencies 설치
                    sh 'npm install'
                }
            }
        }

        stage("CI: Front Build"){
            steps{
                script{
                    dir("fe/ootd/android"){
                        sh 'chmod 777 gradlew'
                       sh './gradlew assembleRelease'
                    }
                }
            }

        }

        stage('CI : Archive APK for FE') {
            steps {
                // 빌드된 APK 파일을 Jenkins에 아카이브
                archiveArtifacts artifacts: 'fe/ootd/android/app/build/outputs/apk/release/app-release.apk', fingerprint: true
            }
        }

        stage("CI: Determine Changed Services") {
            steps {
                script {
                    // getChangedServices를 한 번만 호출하여 전역 변수에 저장
                    def services = ['user', 'battle', 'gallery']
                    changedServices = getChangedServices(services)
                    echo "Changed Services: ${changedServices}"
                }
            }
        }

        stage('CI: Build be') {
            steps {
                script {
                    // 변경된 서비스만 빌드
                    for (service in changedServices) {
                        dir("be/${service}/ootd") {
                            // 설정 파일 복사
                            // withCredentials([file(credentialsId: "ootd-be-${service}-properties", variable: 'properties')]) {
                            //     echo "Copying application.properties for ${service}"
                            //     sh 'pwd'
                            //     sh 'ls'
                            //     sh 'chmod +r $properties'
                            //     sh 'chmod -R 777 src/main/resources'
                            //     sh 'cp $properties src/main/resources/application.properties'
                            //     sh 'ls'
                            // }

                            // 빌드
                            echo "Building ${service}"
                            def gradleHome = tool name: 'ootd-gradle', type: 'gradle'
                            sh 'chmod 777 gradlew'
                            sh './gradlew bootJar'
                            sh 'ls build/libs'

                            // 아카이브
                            echo "Archiving ${service}"
                            archiveArtifacts artifacts: '**/build/libs/*.jar', allowEmptyArchive: true
                        }
                    }
                }
            }
        }// build stage end

        stage("CD: Build Docker Image") {
            steps {
                script {
                    // 변경된 서비스만 docker image 만들기
                    for (service in changedServices) {
                        dir("be/${service}/ootd") {
                            echo "${service} docker image"
                            sh "docker build -t ${DOCKER_IMAGE_BE}-${service} ."
                        }
                    }
                }
            }
        }// end stage docker image 

        stage("CD: Deploy Docker Container with docker compose") {
            steps {
                script {
                    echo "Deploy Docker Container start"
                    for (service in changedServices) {
                        dir("be/${service}/ootd") {
                            echo "Deploy Docker Container: ${service}"
                            sh "docker-compose -f docker-compose-${service}.yml down"
                            sh "docker-compose -f docker-compose-${service}.yml up --build -d"
                        }
                    }
                    echo "Deploy Docker Container end"
                }
            }
        }// end Deploy Docker Container with docker compose
    }
}

// 함수 정의
def getChangedServices(services) {
    def changedServices = []
    for (service in services) {
        def changes = sh(script: "git diff --name-only HEAD~1 HEAD | grep 'be/${service}' || true", returnStdout: true).trim()
        if (changes) {
            changedServices.add(service)
        }
    }
    return changedServices
}
