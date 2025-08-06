#!/usr/bin/env python3
"""
Video Clip Combiner - A tool to combine multiple video clips
Supports concatenation, overlay, and various video editing operations
"""

import os
import sys
from typing import List, Tuple, Optional
from pathlib import Path
import argparse

try:
    from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip
    from moviepy.video.fx import resize
except ImportError:
    print("Error: moviepy is not installed. Please install it with:")
    print("pip install moviepy")
    sys.exit(1)


class VideoClipCombiner:
    def __init__(self):
        self.supported_formats = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm']
    
    def validate_video_file(self, file_path: str) -> bool:
        """Check if the file is a valid video file"""
        path = Path(file_path)
        return path.exists() and path.suffix.lower() in self.supported_formats
    
    def concatenate_clips(self, input_files: List[str], output_file: str, 
                         resize_to: Optional[Tuple[int, int]] = None) -> bool:
        """
        Concatenate multiple video clips end-to-end
        
        Args:
            input_files: List of video file paths
            output_file: Output file path
            resize_to: Optional tuple (width, height) to resize all clips
        """
        try:
            clips = []
            
            for file_path in input_files:
                if not self.validate_video_file(file_path):
                    print(f"Warning: Skipping invalid file {file_path}")
                    continue
                
                clip = VideoFileClip(file_path)
                
                if resize_to:
                    clip = clip.resize(resize_to)
                
                clips.append(clip)
            
            if not clips:
                print("Error: No valid video files found")
                return False
            
            # Concatenate all clips
            final_clip = concatenate_videoclips(clips)
            
            # Write the output file
            final_clip.write_videofile(output_file, codec='libx264', audio_codec='aac')
            
            # Clean up
            final_clip.close()
            for clip in clips:
                clip.close()
            
            print(f"Successfully created: {output_file}")
            return True
            
        except Exception as e:
            print(f"Error concatenating clips: {e}")
            return False
    
    def overlay_clips(self, background_file: str, overlay_files: List[str], 
                     output_file: str, positions: List[Tuple[int, int]] = None) -> bool:
        """
        Overlay multiple clips on top of a background video
        
        Args:
            background_file: Background video file path
            overlay_files: List of overlay video file paths
            output_file: Output file path
            positions: List of (x, y) positions for each overlay (default: center)
        """
        try:
            if not self.validate_video_file(background_file):
                print(f"Error: Invalid background file {background_file}")
                return False
            
            background = VideoFileClip(background_file)
            clips = [background]
            
            for i, overlay_file in enumerate(overlay_files):
                if not self.validate_video_file(overlay_file):
                    print(f"Warning: Skipping invalid overlay file {overlay_file}")
                    continue
                
                overlay = VideoFileClip(overlay_file)
                
                # Set position (default to center)
                if positions and i < len(positions):
                    x, y = positions[i]
                    overlay = overlay.set_position((x, y))
                else:
                    overlay = overlay.set_position('center')
                
                clips.append(overlay)
            
            # Create composite video
            final_clip = CompositeVideoClip(clips)
            
            # Write the output file
            final_clip.write_videofile(output_file, codec='libx264', audio_codec='aac')
            
            # Clean up
            final_clip.close()
            for clip in clips:
                clip.close()
            
            print(f"Successfully created overlay video: {output_file}")
            return True
            
        except Exception as e:
            print(f"Error creating overlay: {e}")
            return False
    
    def create_picture_in_picture(self, main_file: str, pip_file: str, 
                                 output_file: str, pip_size: Tuple[int, int] = (320, 240),
                                 pip_position: str = 'bottom-right') -> bool:
        """
        Create a picture-in-picture effect
        
        Args:
            main_file: Main video file path
            pip_file: Picture-in-picture video file path
            output_file: Output file path
            pip_size: Size of the PIP video (width, height)
            pip_position: Position of PIP ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center')
        """
        try:
            if not self.validate_video_file(main_file) or not self.validate_video_file(pip_file):
                print("Error: Invalid video file(s)")
                return False
            
            main_video = VideoFileClip(main_file)
            pip_video = VideoFileClip(pip_file).resize(pip_size)
            
            # Calculate position
            if pip_position == 'top-left':
                position = (10, 10)
            elif pip_position == 'top-right':
                position = (main_video.w - pip_size[0] - 10, 10)
            elif pip_position == 'bottom-left':
                position = (10, main_video.h - pip_size[1] - 10)
            elif pip_position == 'bottom-right':
                position = (main_video.w - pip_size[0] - 10, main_video.h - pip_size[1] - 10)
            else:  # center
                position = 'center'
            
            pip_video = pip_video.set_position(position)
            
            # Create composite
            final_clip = CompositeVideoClip([main_video, pip_video])
            
            # Write the output file
            final_clip.write_videofile(output_file, codec='libx264', audio_codec='aac')
            
            # Clean up
            final_clip.close()
            main_video.close()
            pip_video.close()
            
            print(f"Successfully created PiP video: {output_file}")
            return True
            
        except Exception as e:
            print(f"Error creating PiP: {e}")
            return False


def main():
    parser = argparse.ArgumentParser(description='Combine multiple video clips')
    parser.add_argument('--mode', choices=['concatenate', 'overlay', 'pip'], 
                       default='concatenate', help='Combination mode')
    parser.add_argument('--input', nargs='+', required=True, 
                       help='Input video files')
    parser.add_argument('--output', required=True, 
                       help='Output video file')
    parser.add_argument('--resize', nargs=2, type=int, 
                       help='Resize all clips to width height (for concatenate mode)')
    parser.add_argument('--pip-size', nargs=2, type=int, default=[320, 240],
                       help='Size of picture-in-picture (width height)')
    parser.add_argument('--pip-position', 
                       choices=['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'],
                       default='bottom-right', help='Position of picture-in-picture')
    
    args = parser.parse_args()
    
    combiner = VideoClipCombiner()
    
    if args.mode == 'concatenate':
        resize_to = tuple(args.resize) if args.resize else None
        success = combiner.concatenate_clips(args.input, args.output, resize_to)
    elif args.mode == 'overlay':
        if len(args.input) < 2:
            print("Error: Overlay mode requires at least 2 input files (background + overlay)")
            sys.exit(1)
        background = args.input[0]
        overlays = args.input[1:]
        success = combiner.overlay_clips(background, overlays, args.output)
    elif args.mode == 'pip':
        if len(args.input) != 2:
            print("Error: PiP mode requires exactly 2 input files (main + pip)")
            sys.exit(1)
        success = combiner.create_picture_in_picture(
            args.input[0], args.input[1], args.output, 
            tuple(args.pip_size), args.pip_position
        )
    
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()