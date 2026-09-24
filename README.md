# AI와 함께하는 건축 자동화

건축사사무소를 위한 한국어 HTML 교재. 17개 단원, 상세 해설, 5초 핵심 키워드 강조, 문단별 오디오 자동 스크롤, 동적 매스 실습을 포함합니다.

## 열기
index.html을 브라우저에서 엽니다. 인터넷이 없어도 로컬 본문·음성·예제는 사용할 수 있습니다. YouTube 임베드와 외부 출처는 인터넷이 필요합니다.
음성은 사용자가 재생을 눌러야 시작합니다. 자동 스크롤과 강조는 개별적으로 끌 수 있습니다.

## 실제 생성·확인한 결과
- Blender 5.2.2 LTS에서 Python 예제 실행, 조감도·상부 투영 PNG 및 .blend 생성.
- 입력 기준 면적 216㎡, 층별 면적 합 648㎡, 매스 높이 10.8m.
- Python 도면 예제로 개념 배치·입면·단면 SVG 생성.
- GitHub 인증, HeyGen 한국어 음성 목록 조회 및 음성 생성.
- HeyGen의 무료 TTS 잔여량 제한 후, 전체 본 해설은 Windows Microsoft Heami Desktop으로 생성. HeyGen 샘플은 별도 수록.
- 문단마다 음성을 생성한 뒤 실제 파일 길이로 구간표 작성. 빨간 밑줄은 5초 단위 학습 키워드이며 음소·단어 강제 정렬 자막이 아님.

## 자료 범위
YouTube 3개는 제목·게시자·공개 설명란·게시자 목차까지 확인했습니다. 자막 본문 응답이 비어 전체 발언과 시연을 검증하지 못했습니다. 교재에서 그 한계를 표시합니다.
SketchUp 예제는 공식 Ruby API를 참고한 교육용 코드이며 이 환경에서 SketchUp 실행 검증은 하지 않았습니다.
Canva, Figma, CapCut, Runway, Google Drive는 제공된 도구 목록을 바탕으로 활용 절차를 설명하며 해당 계정에서 실제 쓰기 작업을 수행했다고 주장하지 않습니다.
Higgsfield와 SketchUp 전용 MCP 도구는 현재 세션에 없습니다. Blender 로컬 설치와 MCP 연결 상태는 별개입니다.
모든 프로젝트 조건은 가상입니다. 개념 매스 및 SVG는 인허가·시공용 도서가 아닙니다.

## 파일
- examples/project.json : 공통 입력
- examples/blender_build.py : Blender 모델·렌더 생성
- examples/sketchup_build.rb : SketchUp 데스크톱 Ruby 콘솔 실습
- examples/generate_drawings.py : Python 표준 라이브러리만 사용하는 SVG 도면 예제
- assets/training-building.blend : 생성된 모델
- audio/full-guide.mp3 : 전체 해설
- audio/*.mp3 : 단원별 해설
- audio-timing.json : 문단별 시간 구간
- narration.txt : 전체 원고

Blender 예제는 전용 장면을 새로 만들지만 실행 시 출력 파일은 같은 이름으로 갱신됩니다. 비교하려는 출력은 먼저 별도 보관하세요.
SketchUp 예제는 같은 교육용 그룹이 존재하면 중복 생성을 중단합니다.

## GitHub Pages
공개 저장소 Settings → Pages → Deploy from a branch → main / root로 게시합니다.
상대 경로를 사용하므로 저장소 하위 URL에서도 동작합니다. .nojekyll을 포함합니다.
교재 HTML은 외부 MCP에 직접 연결하거나 방문자의 로컬 프로그램을 실행하지 않습니다.

## 검증 및 출처
각 장의 링크, 참고 영상의 게시자 설명, assets/validation.json과 본문 확인 범위를 참고하세요.
조사 기준일: 2026-09-24.
