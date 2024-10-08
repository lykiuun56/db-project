<template>
  <transition name="fade">
    <div v-if="show" :class="['persistent-alert', `alert-${type}`]">
      <div class="alert-content">
        <span>{{ message }}</span>
        <button v-if="dismissible" @click="dismiss" class="close-btn">&times;</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PersistentAlert',
  props: {
    show: Boolean,
    message: String,
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    dismiss() {
      this.$emit('dismiss');
    }
  }
}
</script>

<style scoped>
.persistent-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 350px;
  text-align: center;
}

.alert-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  margin-top: 10px;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.close-btn:hover {
  opacity: 1;
}

.alert-info {
  background-color: #2196F3;
  color: white;
}

.alert-success {
  background-color: #4CAF50;
  color: white;
}

.alert-warning {
  background-color: #FFC107;
  color: black;
}

.alert-error {
  background-color: #F44336;
  color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -60%);
}
</style>