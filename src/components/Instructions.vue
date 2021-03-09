<template>
    <div class="video-my">
        <!-- 设置操作说明文件播放为自动，循环，静音播放 -->
        <video
        autoplay="autoplay"
        muted loop="loop"
        width="100%"
        height="90%">
            <source type="video/mp4"  src="../assets/video/操作说明dev.mp4"  >
        </video>
    </div>
</template>
<script>
export default {
};
</script>
<style scoped>
    .video-my {
        margin: 0 auto;
        padding-top: 5%;
    }
</style>
