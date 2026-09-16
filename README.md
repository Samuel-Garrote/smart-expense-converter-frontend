# Smart Expense Converter — Frontend

Single-page Angular app: type a foreign expense in plain language, and see it converted to EUR in real time — no button, no page reloads.

Live: [smart-expense-converter-frontend.vercel.app](https://smart-expense-converter-frontend.vercel.app)

## Tech stack

- **Angular 21** — standalone components, no NgModules
- **Reactive Forms** + **RxJS** (\`debounceTime\` + \`switchMap\`) for reactive, debounced input handling
- Plain **CSS** (in a \`.scss\` file)
- Deployed on **Vercel**

## How it works

1. You type a sentence like \`Dinner in New York, 45 dollars\`.
2. After 500ms of silence, the app calls the backend's \`/api/expenses/convert\` endpoint.
3. If you keep typing before the previous request finishes, it's cancelled automatically (\`switchMap\`) — only the latest one counts.
4. The result (or an error message, if the request fails) is displayed live.

This frontend has no business logic of its own — all extraction and conversion happens on the [backend](https://github.com/Samuel-Garrote/smart-expense-converter-backend).

## Running locally

\`\`\`bash
npm install
ng serve
\`\`\`

By default, \`src/environments/environment.ts\` points to \`http://localhost:8080/api\` — you'll need the backend running locally too, or point it at the deployed Railway URL instead.

## Building for production

\`\`\`bash
ng build
\`\`\`

\`environment.prod.ts\` (pointing to the Railway backend) is swapped in automatically via \`angular.json\`'s \`fileReplacements\`.
