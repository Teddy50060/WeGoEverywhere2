# How to generate Api
- Go to frontend folder directory ( WeGoEverywhere\projects\frontend> )
- then run this command
- npm run generate-api
- if success, "✅ OpenAPI config patched successfully" appeared

# [OBSULETE]
## At frontend folder level
- npx openapi -i http://localhost:3001/v1/api-json -o src/lib/api
- change core/OpenAPI.ts -> WITH_CREDENTIALS: true,

