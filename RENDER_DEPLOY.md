# Indi redesign sizing: Render private link

## Deploy

1. Push this folder to a Git repo.
2. In Render, create a new **Blueprint** from the repo, or create a **Web Service** manually.
3. Use:

```text
Build Command: npm install
Start Command: npm start
```

4. Add environment variable:

```text
PRIVATE_LINK_TOKEN=<long-random-secret>
```

5. Add a persistent disk:

```text
Mount path: /var/data
Size: 1 GB
```

6. Add environment variable:

```text
DATA_FILE=/var/data/sizing.json
```

If you deploy through `render.yaml`, the disk and `DATA_FILE` are already declared. You still need to set `PRIVATE_LINK_TOKEN` in Render.

## Private Link

Open the shared table by private link:

```text
https://<service>.onrender.com/?key=<long-random-secret>
```

## Behavior

- With `?key=...`, the table loads and saves one shared JSON document through `/api/sizing`.
- Without the key, the table works locally through browser `localStorage`.
- The key is not a login. Anyone with the link can edit the shared version.
- The persistent disk is required. Without it, Render can lose the saved JSON after redeploy/restart.
- Use the built-in JSON export as a backup before large edits.
