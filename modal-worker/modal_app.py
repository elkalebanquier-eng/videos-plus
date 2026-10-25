from __future__ import annotations

import os
import signal
import subprocess

import modal

APP_NAME = "videos-plus-renderer"
PORT = 10000
WORKER_DIR = "/worker"

app = modal.App(APP_NAME)

image = (
    modal.Image.from_registry("node:22-bookworm-slim", add_python="3.11")
    .apt_install(
        "ca-certificates",
        "chromium",
        "ffmpeg",
        "fonts-liberation",
    )
    .add_local_dir(os.path.dirname(__file__), remote_path=WORKER_DIR, copy=True)
    .run_commands(f"cd {WORKER_DIR} && npm ci --omit=dev")
)

_worker: subprocess.Popen | None = None


@app.function(
    image=image,
    cpu=2,
    memory=4096,
    min_containers=0,
    max_containers=1,
    scaledown_window=60,
    timeout=3600,
    startup_timeout=240,
    name="serve",
)
@modal.web_server(PORT, startup_timeout=240, label="videos-plus-renderer")
def serve() -> None:
    """Expose the current Node/Chromium worker; Modal starts and stops it on demand."""
    global _worker
    env = os.environ.copy()
    env.update(
        {
            "PORT": str(PORT),
            "CHROMIUM_PATH": "/usr/bin/chromium",
            "MAX_RENDER_SECONDS": "180",
            "PUBLIC_APP_URL": "https://elka-jobnet.vercel.app",
            "PUBLIC_BASE_URL": "https://elkalebanquier--videos-plus-renderer.us-east.modal.run",
            "ALLOWED_ORIGIN": "https://elka-jobnet.vercel.app",
            "NODE_ENV": "production",
        }
    )
    _worker = subprocess.Popen(
        ["node", "server.js"],
        cwd=WORKER_DIR,
        env=env,
        stdin=subprocess.DEVNULL,
        stdout=None,
        stderr=None,
        start_new_session=True,
    )


if __name__ == "__main__":
    print(f"Deploy with: modal deploy {__file__}")
