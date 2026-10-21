"""Build the /mads/ hero loop. Requires ffmpeg on PATH or FFMPEG set."""
import os
from pathlib import Path
import shlex
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/assets/funnel-journey/hero'
FFMPEG = os.environ.get('FFMPEG', 'ffmpeg')


def run(*args):
    command = [FFMPEG, '-hide_banner', '-y', *map(str, args)]
    print(shlex.join(command), flush=True)
    subprocess.run(command, check=True)


OUT.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as temporary:
    forward = Path(temporary) / 'forward.mp4'
    # Over the first 2 source seconds, speed rises smoothly from ~0.9x to 1x.
    # The timestamp derivative is continuous at the transition.
    run('-i', ROOT / 'video-hero.mp4', '-an', '-vf',
        "setpts='(T+0.12*(min(T,2)-min(T,2)*min(T,2)/4))/TB',fps=30",
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '16', '-threads', '2',
        '-pix_fmt', 'yuv420p', forward)
    # Drop the reverse segment's first/last frames so turning points aren't held twice.
    run('-i', forward, '-filter_complex',
        '[0:v]split[f][r];[f]setpts=PTS-STARTPTS[fwd];'
        '[r]reverse,trim=start_frame=1,reverse,trim=start_frame=1,reverse,'
        'setpts=PTS-STARTPTS[rev];[fwd][rev]concat=n=2:v=1:a=0[out]',
        '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'fast',
        '-crf', '18', '-threads', '2', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
        '-movflags', '+faststart', OUT / 'hero-background.mp4')
run('-i', OUT / 'hero-background.mp4', '-vf', 'scale=960:-2', '-an',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '29', '-threads', '2',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    OUT / 'hero-background-backdrop.mp4')
run('-i', OUT / 'hero-background.mp4', '-frames:v', '1', '-vf', 'scale=1920:-2',
    '-q:v', '2', '-update', '1', OUT / 'hero-background-poster.jpg')
