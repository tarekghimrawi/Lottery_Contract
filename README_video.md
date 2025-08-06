# Video Clip Combiner

A powerful Python tool for combining multiple video clips with various editing options.

## Features

- **Concatenation**: Join multiple video clips end-to-end
- **Overlay**: Layer multiple videos on top of each other
- **Picture-in-Picture**: Create PiP effects with customizable positioning
- **Resize**: Automatically resize clips to match dimensions
- **Multiple Formats**: Supports MP4, AVI, MOV, MKV, WMV, FLV, WebM

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Make the script executable:
```bash
chmod +x video_clip_combiner.py
```

## Usage Examples

### 1. Concatenate Multiple Clips
Join several video clips into one continuous video:
```bash
python video_clip_combiner.py --mode concatenate \
    --input clip1.mp4 clip2.mp4 clip3.mp4 \
    --output combined_video.mp4
```

### 2. Concatenate with Resize
Combine clips and resize them all to 1920x1080:
```bash
python video_clip_combiner.py --mode concatenate \
    --input clip1.mp4 clip2.mp4 clip3.mp4 \
    --output combined_video.mp4 \
    --resize 1920 1080
```

### 3. Create Overlay Video
Layer multiple videos on top of a background:
```bash
python video_clip_combiner.py --mode overlay \
    --input background.mp4 overlay1.mp4 overlay2.mp4 \
    --output overlay_video.mp4
```

### 4. Picture-in-Picture Effect
Create a PiP video with a small video in the corner:
```bash
python video_clip_combiner.py --mode pip \
    --input main_video.mp4 pip_video.mp4 \
    --output pip_result.mp4 \
    --pip-size 320 240 \
    --pip-position bottom-right
```

## Command Line Options

- `--mode`: Combination mode (`concatenate`, `overlay`, `pip`)
- `--input`: Input video files (one or more)
- `--output`: Output video file path
- `--resize`: Resize all clips to specified dimensions (width height)
- `--pip-size`: Size of picture-in-picture video (width height)
- `--pip-position`: Position of PiP video (`top-left`, `top-right`, `bottom-left`, `bottom-right`, `center`)

## Supported Video Formats

- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- MKV (.mkv)
- WMV (.wmv)
- FLV (.flv)
- WebM (.webm)

## Tips

1. **Performance**: Video processing can be CPU-intensive. For large files, consider processing during off-peak hours.

2. **Quality**: The output uses H.264 codec for video and AAC for audio, providing good quality and compatibility.

3. **Memory**: Large video files require significant RAM. Close other applications if you encounter memory issues.

4. **Format Compatibility**: Ensure your input videos are in supported formats and not corrupted.

## Troubleshooting

- **"moviepy is not installed"**: Run `pip install moviepy`
- **"No valid video files found"**: Check that your input files exist and are in supported formats
- **Memory errors**: Try processing smaller clips or reduce video resolution
- **Codec errors**: Ensure your system has the necessary codecs installed

## Advanced Usage

You can also use the `VideoClipCombiner` class directly in your Python code:

```python
from video_clip_combiner import VideoClipCombiner

combiner = VideoClipCombiner()

# Concatenate clips
combiner.concatenate_clips(
    ['clip1.mp4', 'clip2.mp4', 'clip3.mp4'],
    'output.mp4',
    resize_to=(1920, 1080)
)

# Create PiP
combiner.create_picture_in_picture(
    'main.mp4', 'pip.mp4', 'result.mp4',
    pip_size=(320, 240),
    pip_position='bottom-right'
)
```