# Solar MCP

Upstage Solar Pro2, Solar Mini 모델을 위한 MCP(Model Context Protocol) 서버입니다.

## 설치

```bash
npm install solar-mcp
```

또는 로컬에서 빌드:

```bash
git clone https://github.com/your-repo/solar-mcp.git
cd solar-mcp
npm install
npm run build
```

## 설정

### 환경 변수

```bash
export UPSTAGE_API_KEY="your-api-key"
```

> **참고:** 환경 변수에 `UPSTAGE_API_KEY`를 설정하면 Claude Desktop 설정 파일의 `env` 섹션에서 API 키를 생략할 수 있습니다.

### Claude Code 설정

Claude Code CLI에서 다음 명령어로 MCP 서버를 추가할 수 있습니다:

```bash
claude mcp add solar -- npx solar-mcp
```

환경 변수와 함께 설정하려면:

```bash
claude mcp add solar -e UPSTAGE_API_KEY=your-api-key -- npx solar-mcp
```

설정 확인:

```bash
claude mcp list
```

## 기능

### Tools

#### solar_chat

Solar 모델에 채팅 완성 요청을 보냅니다.

**파라미터:**

| 파라미터 | 타입 | 필수 | 설명 |
| -------- | ---- | ---- | ---- |
| messages | array | Y | 대화 메시지 배열 [{role, content}] |
| model | string | N | 모델 선택 (기본값: solar-pro2) |
| temperature | number | N | 창의성 조절 (0-2) |
| max_tokens | number | N | 최대 생성 토큰 수 |
| top_p | number | N | 누적 확률 임계값 |
| stop | array | N | 중단 시퀀스 |
| stream | boolean | N | 스트리밍 여부 (기본값: true) |

**사용 예시:**

```
solar_chat 도구를 사용해서 "안녕하세요"라고 인사해주세요.
```

### Resources

#### solar://usage

현재 세션의 API 사용량 통계를 반환합니다.

```json
{
  "total_prompt_tokens": 100,
  "total_completion_tokens": 200,
  "total_tokens": 300,
  "request_count": 5
}
```

#### solar://models

사용 가능한 Solar 모델 목록을 반환합니다.

```json
[
  {
    "id": "solar-pro2",
    "name": "Solar Pro2",
    "description": "Upstage Solar Pro2 - High performance model"
  },
  {
    "id": "solar-mini",
    "name": "Solar Mini",
    "description": "Upstage Solar Mini - Fast and efficient model"
  }
]
```

## 개발

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 개발 모드 (watch)
npm run dev

# 테스트
npm test

# 린트
npm run lint

# 포맷팅
npm run format
```

## 요구사항

- Node.js 22+
- Upstage API 키 ([console.upstage.ai](https://console.upstage.ai)에서 발급)

## 라이선스

MIT
