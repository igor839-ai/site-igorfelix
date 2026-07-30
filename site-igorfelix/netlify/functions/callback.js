exports.handler = async (event) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const code = (event.queryStringParameters || {}).code;

  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const data = await tokenResp.json();
  const token = data.access_token;
  const ok = Boolean(token);
  const content = ok
    ? { token: token, provider: "github" }
    : { error: (data && data.error) || "no_token" };
  const message =
    "authorization:github:" + (ok ? "success" : "error") + ":" + JSON.stringify(content);

  const body =
    "<!doctype html><html><body><script>(function(){" +
    "function receive(e){window.opener.postMessage(" +
    JSON.stringify(message) +
    ",e.origin);window.removeEventListener('message',receive,false);}" +
    "window.addEventListener('message',receive,false);" +
    "window.opener.postMessage('authorizing:github','*');" +
    "})();</script></body></html>";

  return { statusCode: 200, headers: { "Content-Type": "text/html" }, body: body };
};
