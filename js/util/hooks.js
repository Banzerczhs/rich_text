let hookStates = []; // 用于存储各个 useState 的值
let hookIndex = 0;   // 用于记录当前正在执行的 hook 的索引

// 模拟 useState
function useState(initialValue) {
  const currentIndex = hookIndex;  // 保留当前 Hook 索引
  hookStates[currentIndex] = hookStates[currentIndex] !== undefined ? hookStates[currentIndex] : initialValue;

  const setState = (newValue) => {
    hookStates[currentIndex] = newValue;
    render(); // 重新渲染组件
  };

  hookIndex++;  // Hook 索引前进
  return [hookStates[currentIndex], setState];
}