// 无限滚动功能实现
// 作者：梁海霞
// 日期：2025-10-20

// 全局变量
let currentPage = 1;       // 当前页码
let isLoading = false;     // 是否正在加载
let hasMoreContent = true; // 是否有更多内容
const loadingThreshold = 200; // 提前加载的阈值（距离底部多少像素时开始加载）

/**
 * 从服务器加载更多内容
 */
async function loadMoreContent() {
    // 如果已经没有更多内容或者正在加载中，直接返回
    if (!hasMoreContent || isLoading) {
        return;
    }
    
    // 设置加载状态
    isLoading = true;
    document.getElementById('loading').style.display = 'block';
    
    try {
        // 发送请求获取更多内容
        const response = await fetch(`/infinite-scroll?page=${currentPage}&count=5`);
        
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 解析JSON响应
        const data = await response.json();
        
        console.log('加载的内容:', data);
        
        // 检查请求是否成功
        if (data.success) {
            // 渲染新内容
            renderContent(data.content);
            
            // 更新状态
            hasMoreContent = data.has_more;
            currentPage++;
            
            // 如果没有更多内容，显示结束消息
            if (!hasMoreContent) {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('end-message').style.display = 'block';
            }
        } else {
            throw new Error(data.error || '加载内容失败');
        }
    } catch (error) {
        console.error('加载内容时出错:', error);
        
        // 显示错误消息
        const errorMessage = document.createElement('div');
        errorMessage.className = 'content-item';
        errorMessage.style.backgroundColor = '#ffeaea';
        errorMessage.style.color = '#e74c3c';
        errorMessage.innerHTML = `
            <div class="content-header">
                <span class="content-id">错误</span>
            </div>
            <div class="content-text">加载内容时出错: ${error.message}</div>
        `;
        
        // 将错误消息添加到内容容器的底部
        const contentContainer = document.getElementById('content-container');
        contentContainer.appendChild(errorMessage);
    } finally {
        // 无论成功或失败，都重置加载状态
        isLoading = false;
        document.getElementById('loading').style.display = 'none';
    }
}

/**
 * 渲染内容到页面中
 * @param {Array} contentArray - 内容数组
 */
function renderContent(contentArray) {
    const contentContainer = document.getElementById('content-container');
    
    // 遍历内容数组，为每个内容项创建HTML元素
    contentArray.forEach(item => {
        const contentItem = document.createElement('div');
        contentItem.className = 'content-item';
        
        // 设置内容项的HTML
        contentItem.innerHTML = `
            <div class="content-header">
                <span class="content-id">${item.id}</span>
                <span class="content-timestamp">${item.timestamp}</span>
            </div>
            <div class="content-text">${item.content}</div>
        `;
        
        // 添加动画效果
        contentItem.style.opacity = '0';
        contentItem.style.transform = 'translateY(20px)';
        contentItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // 将内容项添加到容器中
        contentContainer.appendChild(contentItem);
        
        // 强制重排以触发动画
        void contentItem.offsetWidth;
        
        // 添加动画效果
        contentItem.style.opacity = '1';
        contentItem.style.transform = 'translateY(0)';
    });
}

/**
 * 检查是否需要加载更多内容
 * @returns {boolean} - 是否需要加载更多内容
 */
function shouldLoadMore() {
    // 获取滚动位置和页面高度
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    
    // 当滚动到距离底部一定距离时，返回true
    return (scrollPosition + windowHeight) >= (documentHeight - loadingThreshold);
}

/**
 * 滚动事件处理函数
 */
function handleScroll() {
    if (shouldLoadMore()) {
        loadMoreContent();
    }
}

/**
 * 初始化函数
 */
function init() {
    console.log('初始化无限滚动...');
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 初始加载第一页内容
    loadMoreContent();
    
    // 添加窗口大小改变事件监听器，以处理响应式布局
    window.addEventListener('resize', handleScroll);
    
    console.log('无限滚动初始化完成');
}

// 当页面加载完成后，初始化无限滚动功能
document.addEventListener('DOMContentLoaded', init);

// 添加清理函数，避免内存泄漏
window.addEventListener('beforeunload', () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
});