from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render
import random

# Create your views here.
def index(request):
    """
    主页面视图 - 显示单页应用的主页面
    """
    return render(request, 'myapp/index.html')

# 各部分的文本内容
texts = [
    "这是第一部分内容。本部分介绍了单页应用程序的基本概念。单页应用程序(SPA)允许用户在不重新加载整个页面的情况下与网站交互。",
    "这是第二部分内容。本部分讲解了如何使用JavaScript操作DOM来实现页面切换效果。通过显示和隐藏不同的div元素，可以模拟多页面的体验。",
    "这是第三部分内容。本部分介绍了如何使用AJAX从服务器获取数据，以及如何使用History API来管理浏览器历史记录和URL更新。"
]

# 生成更多内容用于无限滚动
def generate_more_content(start_index, count=5):
    """
    生成更多内容用于无限滚动
    参数:
        start_index: 起始索引
        count: 需要生成的内容数量
    返回:
        生成的内容列表
    """
    content_list = []
    for i in range(start_index, start_index + count):
        # 随机选择一个基础文本并添加编号信息
        base_text = random.choice(texts)
        content_list.append({
            'id': i,
            'content': f"内容 #{i}: {base_text}",
            'timestamp': f"加载时间戳: {random.randint(1000000, 9999999)}"
        })
    return content_list

def section(request, num):
    """
    提供特定部分的文本内容
    参数:
        num: 部分编号
    返回:
        指定部分的文本内容，如果编号无效则返回404错误
    """
    if 1 <= num <= 3:
        return HttpResponse(texts[num - 1])
    else:
        raise Http404("没有找到该部分内容")

def infinite_scroll(request):
    """
    无限滚动API端点
    参数:
        page: 请求的页码，默认为1
        count: 每页的内容数量，默认为5
    返回:
        JSON格式的内容数据
    """
    try:
        # 获取请求参数
        page = int(request.GET.get('page', 1))
        count = int(request.GET.get('count', 5))
        
        # 计算起始索引
        start_index = (page - 1) * count + 1
        
        # 生成内容
        content = generate_more_content(start_index, count)
        
        # 返回JSON响应
        return JsonResponse({
            'success': True,
            'page': page,
            'count': count,
            'content': content,
            'has_more': True  # 这里可以设置一个上限，比如page < 100
        })
    except Exception as e:
        # 处理错误
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def infinite_scroll_page(request):
    """
    无限滚动页面视图
    """
    return render(request, 'myapp/infinite_scroll.html')

def addition_game(request):
    """
    加法游戏页面视图
    """
    return render(request, 'myapp/addition_game.html')
