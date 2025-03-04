
interface IResolved {
  type: string | undefined
}
/**
 * 佇列
 */
interface EnqueueMessage {
  [key: string]: any,
  onResult?: (name?: string) => void
}
let running: boolean = false;
// 佇列FIFO
const queue: (() => Promise<void>)[] = []
// 執行佇列
const runNext = async() => {
  console.log(`開始執行下一個任務佇列 running: ${running} queue.length: ${queue.length}`);
  if (running || queue.length === 0) return;
  running = true;
  const task = queue.shift();
  if (task) await task();
  running = false;
  runNext();
}
// 加入佇列
const enqueue = (task: () => Promise<IResolved>): Promise<string> => {
  return new Promise((resolve) => {
    console.log("這是Enqueue佇列scope");
    queue.push(async () => {
      console.log("*開始執行任務佇列");
      await task();
      resolve('done')
    })
    runNext()
  })
}
export const join = (message: EnqueueMessage) => {
  const task = () => new Promise<IResolved>((resolve) => {
    console.log("這是佇列scope");
    setTimeout(() => {
      console.log("等待結束");
      if (message.onResult) message.onResult('這是測試');
      resolve({ type: 'test' });
    }, 1000)
  });
  return enqueue(task);
}
