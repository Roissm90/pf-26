"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Heart, Pause, Play, RotateCcw } from "lucide-react";
import type PhaserTypes from "phaser";

type Status = "loading" | "ready" | "playing" | "paused" | "won" | "lost" | "error";
type Hud = { status: Status; score: number; lives: number };
type Controls = { play: () => void; pause: () => void; restart: () => void };

export function Breakout({ english }: { english: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const [hud, setHud] = useState<Hud>({ status: "loading", score: 0, lives: 3 });

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let game: PhaserTypes.Game | undefined;

    async function initialize() {
      const Phaser = (await import("phaser")).default;
      if (disposed || !container) return;
      const width = 800;
      const height = 600;
      const paddleWidth = 112;
      const paddleY = 546;
      const baseSpeed = 350;
      const accent = 0x64dcb4;

      class BreakoutScene extends Phaser.Scene {
        private ball!: PhaserTypes.GameObjects.Arc;
        private paddle!: PhaserTypes.GameObjects.Rectangle;
        private bricks!: PhaserTypes.Physics.Arcade.StaticGroup;
        private arrows!: PhaserTypes.Types.Input.Keyboard.CursorKeys;
        private status: Status = "ready";
        private score = 0;
        private lives = 3;
        private targetX = width / 2;
        private speed = baseSpeed;
        private pointerControl = false;
        private launchedAt = 0;

        private get ballBody() {
          return this.ball.body as PhaserTypes.Physics.Arcade.Body;
        }

        private get paddleBody() {
          return this.paddle.body as PhaserTypes.Physics.Arcade.StaticBody;
        }

        private publish() {
          setHud({ status: this.status, score: this.score, lives: this.lives });
          container!.dataset.status = this.status;
          container!.dataset.bricks = String(this.bricks.countActive());
        }

        create() {
          this.physics.world.setBounds(0, 0, width, height);
          this.physics.world.setBoundsCollision(true, true, true, false);
          this.paddle = this.add.rectangle(width / 2, paddleY, paddleWidth, 12, accent);
          this.physics.add.existing(this.paddle, true);
          this.ball = this.add.circle(width / 2, paddleY - 16, 7, 0xf4f4f4);
          this.physics.add.existing(this.ball);
          this.ballBody.setCircle(7).setBounce(1).setCollideWorldBounds(true);
          this.bricks = this.physics.add.staticGroup();
          this.buildBricks();
          this.physics.add.collider(this.ball, this.bricks, (_ball, brick) => {
            const block = brick as PhaserTypes.GameObjects.Rectangle;
            if (!block.active) return;
            this.bricks.remove(block, true, true);
            this.score += 10;
            this.speed = Math.min(470, baseSpeed + this.score * 0.2);
            if (this.bricks.countActive() === 0) {
              this.status = "won";
              this.physics.pause();
            }
            this.publish();
          });
          this.physics.add.collider(this.ball, this.paddle, () => {
            if (this.ball.y >= this.paddle.y) return;
            const impact = Phaser.Math.Clamp((this.ball.x - this.paddle.x) / (paddleWidth / 2), -1, 1);
            const angle = impact * Math.PI / 3;
            this.ballBody.setVelocity(Math.sin(angle) * this.speed, -Math.cos(angle) * this.speed);
            this.ball.setY(Math.min(this.ball.y, paddleY - 14));
          });
          this.arrows = this.input.keyboard!.createCursorKeys();
          this.input.keyboard!.addCapture(["LEFT", "RIGHT", "SPACE"]);
          this.input.keyboard!.on("keydown-SPACE", (event: KeyboardEvent) => {
            if (event.repeat || event.target instanceof HTMLElement && event.target.closest("button, a, input")) return;
            if (this.status === "playing") this.pauseGame();
            else if (this.status === "ready" || this.status === "paused") this.playGame();
          });
          this.input.keyboard!.on("keydown-ESC", () => this.pauseGame());
          this.input.on("pointermove", (pointer: PhaserTypes.Input.Pointer) => {
            this.pointerControl = true;
            this.targetX = Phaser.Math.Clamp(pointer.x, paddleWidth / 2, width - paddleWidth / 2);
          });
          this.input.on("pointerdown", (pointer: PhaserTypes.Input.Pointer) => {
            this.pointerControl = true;
            this.targetX = Phaser.Math.Clamp(pointer.x, paddleWidth / 2, width - paddleWidth / 2);
            if (this.status === "ready") this.playGame();
          });
          this.game.events.on(Phaser.Core.Events.BLUR, this.pauseGame, this);
          this.game.events.on(Phaser.Core.Events.HIDDEN, this.pauseGame, this);
          this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.game.events.off(Phaser.Core.Events.BLUR, this.pauseGame, this);
            this.game.events.off(Phaser.Core.Events.HIDDEN, this.pauseGame, this);
          });
          controls.current = {
            play: () => this.playGame(),
            pause: () => this.pauseGame(),
            restart: () => this.restartGame(),
          };
          this.dockBall();
          this.publish();
        }

        private buildBricks() {
          for (let row = 0; row < 5; row++) {
            for (let column = 0; column < 10; column++) {
              const brick = this.add.rectangle(53 + column * 77, 66 + row * 32, 68, 22, accent);
              this.bricks.add(brick);
            }
          }
        }

        private dockBall() {
          this.ballBody.stop();
          this.ballBody.enable = false;
          this.ball.setPosition(this.paddle.x, paddleY - 16);
          this.launchedAt = 0;
        }

        private playGame() {
          if (this.status !== "ready" && this.status !== "paused") return;
          const ready = this.status === "ready";
          this.status = "playing";
          this.physics.resume();
          if (ready) {
            this.ballBody.enable = true;
            this.ballBody.reset(this.paddle.x, paddleY - 16);
            this.ballBody.setVelocity(this.speed * 0.38, -this.speed * Math.sqrt(1 - 0.38 ** 2));
            this.launchedAt = this.time.now;
          }
          this.publish();
        }

        private pauseGame() {
          if (this.status !== "playing") return;
          this.status = "paused";
          this.physics.pause();
          this.publish();
        }

        private restartGame() {
          this.physics.resume();
          this.bricks.clear(true, true);
          this.buildBricks();
          this.score = 0;
          this.lives = 3;
          this.speed = baseSpeed;
          this.targetX = width / 2;
          this.paddle.setX(width / 2);
          this.paddleBody.updateFromGameObject();
          this.status = "ready";
          this.dockBall();
          this.publish();
        }

        update(_time: number, delta: number) {
          if (this.status !== "playing" && this.status !== "ready") return;
          const seconds = Math.min(delta, 32) / 1000;
          if (this.arrows.left.isDown || this.arrows.right.isDown) {
            this.pointerControl = false;
            const direction = Number(this.arrows.right.isDown) - Number(this.arrows.left.isDown);
            this.targetX = Phaser.Math.Clamp(this.paddle.x + direction * 620 * seconds, paddleWidth / 2, width - paddleWidth / 2);
          }
          const nextX = this.pointerControl
            ? Phaser.Math.Linear(this.paddle.x, this.targetX, 1 - Math.exp(-22 * seconds))
            : this.targetX;
          this.paddle.setX(nextX);
          this.paddleBody.updateFromGameObject();
          if (this.status === "ready") {
            this.ball.setX(nextX);
          } else {
            if (this.ball.y > height + 14) {
              this.lives -= 1;
              this.status = this.lives ? "ready" : "lost";
              this.dockBall();
              if (this.status === "lost") this.physics.pause();
              this.publish();
            } else {
              const velocity = this.ballBody.velocity;
              if (Math.abs(velocity.y) < this.speed * 0.28) {
                const vertical = (velocity.y < 0 ? -1 : 1) * this.speed * 0.28;
                this.ballBody.setVelocity((velocity.x < 0 ? -1 : 1) * Math.sqrt(this.speed ** 2 - vertical ** 2), vertical);
              } else {
                velocity.normalize().scale(this.speed);
              }
            }
          }
          container!.dataset.ballX = this.ball.x.toFixed(2);
          container!.dataset.ballY = this.ball.y.toFixed(2);
          container!.dataset.paddleX = this.paddle.x.toFixed(2);
          container!.dataset.speed = this.ballBody.velocity.length().toFixed(2);
          container!.dataset.launchedAt = String(this.launchedAt);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: container,
        width,
        height,
        transparent: true,
        antialias: true,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, fps: 120, fixedStep: true } },
        scene: BreakoutScene,
        input: { activePointers: 2 },
        audio: { noAudio: true },
      });
    }

    initialize().catch((error) => {
      console.error("Breakout initialization failed", error);
      if (!disposed) setHud({ status: "error", score: 0, lives: 3 });
    });
    return () => {
      disposed = true;
      controls.current = null;
      game?.destroy(true);
    };
  }, []);

  const finished = hud.status === "won" || hud.status === "lost";
  const labels = english
    ? { back: "Back to portfolio", play: "Play", pause: "Pause", resume: "Resume", restart: "Restart", score: "Score", lives: "Lives", ready: "Ready", paused: "Paused", won: "Well played", lost: "Game over", loading: "Loading", error: "Unable to load the game", board: "Breakout game board" }
    : { back: "Volver al portfolio", play: "Jugar", pause: "Pausar", resume: "Continuar", restart: "Reiniciar", score: "Puntos", lives: "Vidas", ready: "Listo", paused: "Pausa", won: "Bien jugado", lost: "Fin de partida", loading: "Cargando", error: "No se pudo cargar el juego", board: "Tablero de Breakout" };
  const buttonClass = "flex h-10 w-10 shrink-0 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent";

  return (
    <main lang={english ? "en" : "es"} className="flex min-h-svh flex-1 flex-col px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
        <a href={english ? "/en" : "/"} aria-label={labels.back} title={labels.back} className={buttonClass}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </a>
        <h1 className="font-mono text-lg font-medium">Breakout<span className="text-accent" aria-hidden="true">_</span></h1>
        <div className="flex items-center gap-2">
          <button type="button" className={buttonClass} disabled={hud.status === "loading" || hud.status === "error" || finished} aria-label={hud.status === "playing" ? labels.pause : hud.status === "paused" ? labels.resume : labels.play} title={hud.status === "playing" ? labels.pause : hud.status === "paused" ? labels.resume : labels.play} onClick={() => hud.status === "playing" ? controls.current?.pause() : controls.current?.play()}>
            {hud.status === "playing" ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
          </button>
          <button type="button" className={buttonClass} disabled={hud.status === "loading" || hud.status === "error"} aria-label={labels.restart} title={labels.restart} onClick={() => controls.current?.restart()}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center py-6">
        <div className="mb-4 flex w-full max-w-[800px] items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{labels.score} <span className="ml-2 inline-block w-12 text-foreground">{String(hud.score).padStart(4, "0")}</span></span>
          <span aria-label={`${labels.lives}: ${hud.lives}`} className="flex items-center gap-2">
            {[0, 1, 2].map(index => <Heart key={index} aria-hidden="true" className={`h-3.5 w-3.5 ${index < hud.lives ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />)}
          </span>
        </div>
        <div className="relative aspect-[4/3] w-full max-w-[min(800px,calc((100svh-190px)*4/3))]">
          <div ref={host} role="img" aria-label={labels.board} className="absolute inset-0 touch-none overflow-hidden [&_canvas]:block" />
          {hud.status !== "playing" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div role="status" className="flex flex-col items-center gap-4">
                <p className="font-mono text-lg text-foreground sm:text-2xl">{labels[hud.status as keyof typeof labels]}</p>
                {(hud.status === "ready" || hud.status === "paused" || finished) && (
                  <button type="button" className={`${buttonClass} pointer-events-auto bg-background`} aria-label={finished ? labels.restart : hud.status === "paused" ? labels.resume : labels.play} title={finished ? labels.restart : hud.status === "paused" ? labels.resume : labels.play} onClick={() => finished ? controls.current?.restart() : controls.current?.play()}>
                    {finished ? <RotateCcw aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}