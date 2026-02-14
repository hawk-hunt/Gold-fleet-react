<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gold Fleet - Professional Fleet Management</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    <link rel="stylesheet" href="{{ asset('css/app.css') }}" />
    <style>
        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }
        .video-slide {
            animation: fadeInOut 3s ease-in-out forwards;
        }
    </style>
</head>
<body class="antialiased">
    <!-- Plain HTML landing page with rotating background videos -->
    <div class="relative overflow-hidden min-h-screen">
        <video id="bgVideo" class="absolute inset-0 w-full h-full object-cover video-slide" muted>
            <source src="/background-video/13197481_1920_1080_30fps.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        <!-- Hero content can go here if needed -->
        <div class="relative z-10 flex items-center justify-center h-screen">
            <h1 class="text-white text-4xl">Gold Fleet Management Services</h1>
        </div>
    </div>

    <script>
        (function() {
            const vids = [
                '/background-video/recording3.mp4',
                '/background-video/13197481_1920_1080_30fps.mp4'
            ];
            let idx = 0;
            const videoEl = document.getElementById('bgVideo');
            
            function playVideo() {
                const src = vids[idx];
                const source = videoEl.querySelector('source');
                source.src = src;
                videoEl.load();
                videoEl.play().catch(e => console.log('Video play error:', e));
                
                // reapply animation
                videoEl.style.animation = 'none';
                setTimeout(() => {
                    videoEl.style.animation = 'fadeInOut 3s ease-in-out forwards';
                }, 10);
            }
            
            playVideo();
            setInterval(() => {
                idx = (idx + 1) % vids.length;
                playVideo();
            }, 3000); // 3 seconds
        })();
    </script>
</body>
</html>
