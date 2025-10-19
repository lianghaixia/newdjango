// 单页应用程序JavaScript
// 作者：梁海霞
// 日期：2025-10-19

// 当点击后退箭头时，显示上一个部分
window.onpopstate = function(event) {
    console.log('加载历史状态：', event.state.section);
    showSection(event.state.section);
};

/**
 * 显示指定部分的内容
 * @param {string} section - 部分编号
 */
function showSection(section) {
    // 从服务器获取部分内容
    fetch(`/sections/${section}`)
    .then(response => response.text())
    .then(text => {
        console.log('获取到的内容：', text);
        document.querySelector('#content').innerHTML = text;
    })
    .catch(error => {
        console.error('获取内容失败：', error);
        document.querySelector('#content').innerHTML = '<p style="color: red;">加载内容失败，请重试。</p>';
    });
}

/**
 * 检测滚动位置，当用户滚动到页面底部时显示提示
 */
function checkScrollPosition() {
    // 检查是否已滚动到页面底部
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 100) {
        // 创建提示元素（如果不存在）
        let scrollHint = document.getElementById('scroll-hint');
        if (!scrollHint) {
            scrollHint = document.createElement('div');
            scrollHint.id = 'scroll-hint';
            scrollHint.style.position = 'fixed';
            scrollHint.style.bottom = '20px';
            scrollHint.style.right = '20px';
            scrollHint.style.padding = '10px 15px';
            scrollHint.style.backgroundColor = '#3498db';
            scrollHint.style.color = 'white';
            scrollHint.style.borderRadius = '5px';
            scrollHint.style.fontWeight = 'bold';
            scrollHint.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            scrollHint.style.zIndex = '1000';
            document.body.appendChild(scrollHint);
        }
        scrollHint.textContent = '您已滚动到页面底部！';
        scrollHint.style.display = 'block';
    } else {
        // 隐藏提示
        const scrollHint = document.getElementById('scroll-hint');
        if (scrollHint) {
            scrollHint.style.display = 'none';
        }
    }
}

/**
 * 平滑滚动到页面顶部
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 为所有按钮添加点击事件
    document.querySelectorAll('button').forEach(button => {
        button.onclick = function() {
            const section = this.dataset.section;
            console.log('点击按钮，切换到部分：', section);
            
            // 添加当前状态到历史记录
            history.pushState({section: section}, "", `section${section}`);
            
            // 显示对应部分的内容
            showSection(section);
            
            // 滚动到页面顶部
            scrollToTop();
        };
    });
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', checkScrollPosition);
    
    // 如果URL中有section参数，自动加载对应内容
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1].startsWith('section')) {
        const sectionNum = pathParts[1].replace('section', '');
        if (sectionNum >= 1 && sectionNum <= 3) {
            showSection(sectionNum);
        }
    }
    
    // 添加返回顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.textContent = '↑';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.left = '20px';
    backToTopButton.style.width = '50px';
    backToTopButton.style.height = '50px';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.backgroundColor = '#2ecc71';
    backToTopButton.style.color = 'white';
    backToTopButton.style.border = 'none';
    backToTopButton.style.fontSize = '24px';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    backToTopButton.style.display = 'none';
    backToTopButton.style.zIndex = '1000';
    
    backToTopButton.onclick = scrollToTop;
    document.body.appendChild(backToTopButton);
    
    // 更新返回顶部按钮的显示状态
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
});