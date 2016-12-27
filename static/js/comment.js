var commentTemplate = function(d){
    var c = d.comment
    var u = d.user
    c.content = c.content.replace(/</g, '&lt;')
    c.content = c.content.replace(/>/g, '&gt;')
    var t = `
    <div class="comment-item inner-box clearfix">
        <div class="comment-user-avatar float-left">
            <img class="img-middle" src="${u.avatar}" alt="" />
        </div>
        <div class="comment-item-right float-left">
            <div class="comment-user-name">
                <a class="my-link" href="/user/${u.username}">${u.username}</a>
                <time>刚刚<time>
            </div>
            <div class="comment-comment">
                <span>${c.content}</span>
            </div>
        </div>
    </div>
    `
    return t
}

var replyTemplate = function(d){
    var r = d.reply
    var s = d.sender
    var receiver = d.receiver

    r.content = r.content.replace(/</g, '&lt;')
    r.content = r.content.replace(/>/g, '&gt;')
    var t = `
    <div class="reply-item">
        <div class="reply-item-left">
            <div class="reply-sender-avatar">
                <img class="img-small" src="${s.avatar}">
            </div>
            <div class="reply-sender-url">
                <a href="/${s.username}/info">${s.username}</a>
            </div>
        </div>
        <div class="reply-item-left">
            <div class="reply-content">
                <p>
                   ${r.content}
                </p>
            </div>
        </div>
    </div>
    `
    return t
}

var btnOnNewComment = function(e){
    var btn = e.target
    var box = $(btn).closest('.comment-input-body')
    var message = $('.comment-message').first()
    var list = $('.comment-list').first()
    var content = $('.input-comment').first().val()
    var post_id = $('.input-comment').first().data('postid')
    var form = {
        'content': content,
        'post_id': post_id
    }
    message.text('')
    var response = function(r){
        if (r.success){
                var data = r.data
                var t = commentTemplate(data)
                list.append(t)
        }
        else{
            var message = r.message
            for (var k in message){
                var p_message = $(box).find(k).first()
                p_message.text(message[k])
                p_message.addClass('error')
            }
        }
    }
    api.commentAdd(form, response)
}

var btnOnViewReplies = function(e){
    var btn = e.target
    $(btn).removeClass('not-view')
    var item = $(btn).closest('.comment-item')
    var commentid = item.data('commentid')
    var reply_view = $(item).find('.reply-view')[0]
    var page = $(btn).data('page')
    var form = {
        'commentid': commentid,
        'page':page,
    }
    var response = function(r){
        if (r.success){
                var data = r.data
                reply_view.innerHTML=data
        }
        else{
            var message = r.message
            for (var k in message){
                var p_message = $(item).find(k).first()
                p_message.text(message[k])
                p_message.addClass('error')
            }
        }
    }
    api.commentReplyView(form, response)
}

var btnOnNewReply = function(e){
    var btn = e.target
    var box = $(btn).closest('.reply-view')
    var message = $('.reply-message').first()
    var list = $('.reply-list').first()
    var content = $('.input-reply').first().val()
    var comment_id = $('.input-reply').first().data('commentid')
    if(content.startsWith('回复') && content.includes(':')){
        var receiver_name = content.split('回复 ')[1].split(':')[0]
    }
    var form = {
        'comment_id': comment_id,
        'content': content,
        'receiver_name': receiver_name,
    }
    var response = function(r){
        if (r.success){
                var data = r.data
                var t = replyTemplate(data)
                list.append(t)
        }
        else{
            var message = r.message
            for (var k in message){
                var p_message = $(box).find(k).first()
                p_message.text(message[k])
                p_message.addClass('error')
            }
        }
    }
    api.replyAdd(form, response)
}

var bindEvents = function(){
    $('.btn-new-comment').on('click', btnOnNewComment)
    $('.comment-list').on('click', '.btn-reply-view.not-view', btnOnViewReplies)
    $('.comment-list').on('click', '.reply-page', btnOnViewReplies)
    $('.comment-list').on('click', '.btn-new-reply', btnOnNewReply)
}

var __main = function(){
    bindEvents()
}

$(document).ready(__main)
