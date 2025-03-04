import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    msg: String
  },
  setup(props) {
    const msg = ref(props.msg);

    return () => {
      return <div>
        {msg.value} <span>TSX</span>
      </div>

    }
  }
})
