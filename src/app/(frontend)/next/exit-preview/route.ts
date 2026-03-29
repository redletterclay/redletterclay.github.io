export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  return new Response('Draft mode is disabled')
}
