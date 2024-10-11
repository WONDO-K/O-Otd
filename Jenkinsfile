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
                git branch: 'develop',
                    url: 'https://lab.ssafy.com/s11-bigdata-dist-sub1/S11P21E104.git',
                    credentialsId: "ootd"
            }
        }

        stage("CI: Determine Changed FE") {
            steps {
                script {
                    // getChangedServices를 한 번만 호출하여 전역 변수에 저장
                    isChangeFe = getChangedFe()
                    echo "Changed Fe: ${isChangeFe}"
                }
            }
        }
        stage('Install Dependencies for FE') {
            steps {
                script{
                    if(isChangeFe){
                        dir("fe/ootd"){
                            // 프로젝트의 dependencies 설치
                            echo 'npm install'
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage("CI: Front Build"){
            steps{
                script{
                    if(isChangeFe){
                        dir("fe/ootd/android"){
                            echo 'chmod 777 gradlew'
                            sh 'chmod 777 gradlew'

                            echo 'chmod 777 gradlew'
                            sh './gradlew assembleRelease'
                        }
                    }
                }
            }

        }

        stage('CI : Archive APK for FE') {
            steps {
                script{
                    if(isChangeFe){
                        // 빌드된 APK 파일을 Jenkins에 아카이브
                        archiveArtifacts artifacts: 'fe/ootd/android/app/build/outputs/apk/release/app-release.apk', fingerprint: true
                    }
                }
            }
        }

        stage("CI: Determine Changed Services") {
            steps {
                script {
                    // getChangedServices를 한 번만 호출하여 전역 변수에 저장
                    def services = ['eureka','apigateway','user', 'battle', 'gallery']
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
                            withCredentials([file(credentialsId: "ootd-be-${service}-properties", variable: 'properties')]) {
                                echo "Copying application.yml for ${service}"
                                sh 'pwd'
                                sh 'ls'
                                sh 'chmod +r $properties'
                                sh 'chmod -R 777 src/main/resources'
                                sh 'cp $properties src/main/resources/application.yml'
                                sh 'cat src/main/resources/application.yml'
                                sh 'ls'
                            }
                            //docker-compose.yml 복사
                            withCredentials([file(credentialsId: "ootd-be-${service}-dockercompose", variable: 'compose')]){
                                script {
                                    // 현재 작업 디렉토리 출력
                                    sh 'pwd'

                                    // 작업 디렉토리의 파일 목록 출력
                                    sh 'ls'

                                    // Docker Compose 파일을 프로젝트 루트로 복사 (여기서 목적지 경로를 명시)
                                    sh "cp $compose ."

                                    // 복사 후 작업 디렉토리의 파일 목록 출력
                                    sh 'ls'
                                }
                            }
                            if(service=="user"){
                                withCredentials([file(credentialsId: "ootd-be-${service}-oauth", variable: 'properties')]) {
                                    echo "Copying oauth.yml for ${service}"
                                    sh 'pwd'
                                    sh 'ls'
                                    sh 'chmod +r $properties'
                                    sh 'chmod -R 777 src/main/resources'
                                    sh 'cp $properties src/main/resources/application-oauth.yml'
                                    sh 'ls'
                                }


                            }
                            if(service=="user" || service=="battle"){
                                withCredentials([file(credentialsId: "ootd-be-${service}-env", variable: 'envFile')]) {
                                    // 현재 작업 디렉토리 출력
                                    sh 'pwd'

                                    // 작업 디렉토리의 파일 목록 출력
                                    sh 'ls'

                                    // .env 파일을 프로젝트 루트로 복사 (여기서 목적지 경로를 명시)
                                    sh "cp $envFile ."

                                    // 복사 후 작업 디렉토리의 파일 목록 출력
                                    sh 'ls'
                                }
                            }

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
    post{
        success {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good', 
                message: "# :jenkins1: \n ### 빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/6az88d4jajgybgn5d6qhkyy8ma', 
                channel: 'ootd_jenkins'
                )
            }
        }
        failure {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger', 
                message: "# :jenkins5: \n ### 빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/6az88d4jajgybgn5d6qhkyy8ma', 
                channel: 'ootd_jenkins'
                )
            }
        }
    }
}

// be 변경사항 함수 정의
def getChangedServices(services) {
    def changedServices = []
    
    // changedServices.add("eureka")
    // changedServices.add("apigateway")
    // changedServices.add("user")
    //changedServices.add("user")
    // changedServices.add("battle")
    changedServices.add("gallery")
    for (service in services) {
        def changes = sh(script: "git diff --name-only HEAD~1 HEAD | grep 'be/${service}' || true", returnStdout: true).trim()
        
        if (false) {
            changedServices.add(service)
        }
    }
    return changedServices
}


//fe
def getChangedFe(){
    if(sh(script: "git diff --name-only HEAD~1 HEAD | grep 'fe' || true", returnStdout: true).trim()){
        return true
    }
    return false;
}
