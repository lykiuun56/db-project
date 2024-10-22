<template>
  <v-card class="mx-auto my-4" max-width="400">
    <v-card-text>
      <v-progress-linear
        :value="progress"
        color="primary"
        height="25"
      >
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}% ({{ currentCount }} / {{ totalCount }})</strong>
        </template>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'UploadProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    currentCount: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    }
  }
}
</script>

