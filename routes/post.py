from controllor import post
from models.Node import Node
from . import *

main = Blueprint('post', __name__)

@main.route('/new')
@user_required
def new():
    data = post.edit()
    return render_template('handle_post.html', **data)

@main.route('/<int:post_id>')
def view(post_id):
    comment_page = request.args.get('page', '1')
    data = post.view(post_id, comment_page)
    return render_template('post.html', **data)

@main.route('/edit/<int:post_id>')
@user_required
def edit(post_id):
    data = post.edit(post_id)
    return render_template('handle_post.html', **data)

@main.route('/delete/<int:post_id>')
@user_required
def delete(post_id):
    data = post.delete(post_id)
    return redirect(url_for('index.index'))

