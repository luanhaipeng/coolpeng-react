import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,globalVar,uniqueId} from '../../core/utils/index';
import {toPathParamString,getCategoryIdPath} from './NoteFunctions';
import AvatarReact from '../../service/avatar/AvatarReact';
import SimditorReact from '../../service/editor/SimditorReact';
import ReactForm,{getReactFormValues} from '../../components/form/ReactForm';
import Dialog from '../../components/dialog/Dialog';
import $ from 'jquery';
import './index.less';


function getViewNoteURL(noteId) {
    var pathParams = globalVar('pathParams');
    var nn = Object.assign({}, pathParams, {n: noteId});
    var mm = toPathParamString(nn, ['c', 'n', 'ps', 'pn']);
    var link = '/note/' + mm;
    return link;
}

class NoteSingle extends PureRenderComponent {


    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
        this.reactFormUniqueId = uniqueId("reactFormUniqueId");
    }

    componentWillMount() {
    }


    getEditorContent() {

        var TitleFormValue = getReactFormValues(this.reactFormUniqueId);
        var postTitle = TitleFormValue.postTitle;
        var editor = this.refs['SimditorReact'];
        var pathParams = globalVar('pathParams');
        var content = editor.getContentValue();
        var parseResult = editor.getContentParseResult(content);
        return {
            myCategoryId:pathParams.c,
            categoryId: pathParams.c,
            postContent: content,
            postTitle: postTitle,
            summary:parseResult.summary,
            imageList:parseResult.imageList
        };
    }

    onSaveNote(NoteVO) {
        const {actions} = this.props;
        var editorContent = this.getEditorContent();
        var vo = {accessControl:'private'};
        var isCreating = true;
        if (NoteVO) {
            vo = NoteVO.toJS();
            isCreating = false;
        }

        var that = this;
        vo = Object.assign(vo, editorContent);
        vo.replyPageResult = null;
        actions.saveOrUpdateNote({NoteVO: vo}, function (resolved, payload,data,isSuccess) {
            if(isSuccess){
                var noteId = payload.data.id;
                var link = getViewNoteURL(noteId);
                // that.context.router.push(link);
                that.props.reloadNoteListByCategory();
                Dialog.showMsgSuccess('保存成功');
                if(isCreating){
                     that.context.router.push(link+"-e1");
                }
            }else {
                Dialog.showMsgError('保存失败');
            }
        });
    }

    renderEditing(NoteVO, user, actions, isEditing) {

        var content = null;
        var postTitle = "";
        if (NoteVO) {
            content = NoteVO.get('postContent') || '';
            postTitle = NoteVO.get('postTitle');
        }

        var TitleFormLayout = [{name: 'postTitle', text: '', type: 'input'}];
        var TitleFormValues = {postTitle: postTitle};
        return (
            <div className="NoteSingleEdit">
                <div className="NoteSingleEdit_PostTitle">
                    <ReactForm id={this.reactFormUniqueId} layout={TitleFormLayout} values={TitleFormValues}></ReactForm>
                    <button className="NoteSingleEdit_SaveButton" onClick={this.onSaveNote.bind(this,NoteVO)}> 保存</button>
                </div>
                <div className="NoteSingleEdit_SimditorReact">
                    <SimditorReact ref="SimditorReact" content={content}></SimditorReact>
                </div>
            </div>
        );
    }

    render() {
        const {NoteVO,user,actions,isEditing,pathParams} = this.props;
        try {
            //console.log('NoteVO,isEditing', NoteVO.get('id'), isEditing);
        } catch (e) {

        }

        if(NoteVO){
            if(pathParams.n!= NoteVO.get('id')){
                return <div></div>
            }
        }


        if (!isEditing) {
            if (!NoteVO) {
                return <div className="note-blank"></div>
            }
            var pageId = "NoteSingle_" + NoteVO.get('id');
            var content = NoteVO.get('postContent');
            return (
                <div className="NoteSingleRead">
                    <div className="NoteSingle_PostTitle">{NoteVO.get('postTitle')}</div>
                    <div className="NoteSingle_Content" dangerouslySetInnerHTML={{__html:content}}></div>
                    <div className="NoteSingle_AvatarReact">
                        <AvatarReact user={user} setCurrentTempUser={actions.setCurrentTempUser}
                                     pageId={pageId}></AvatarReact>
                    </div>
                </div>
            );
        } else {
            return this.renderEditing(NoteVO, user, actions, isEditing);
        }
    }
}

NoteSingle.propTypes = {
    router: React.PropTypes.object,
    routeParams: React.PropTypes.object
};

export default NoteSingle;
