

const db = wx.cloud.database();
const collection = db.collection("test");


let timeId = -1;
Page({
  data:{
    list:[],
    name:""
  },

  // 页面显示 就渲染数据
 async onShow(){
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    const res =await collection.get();
    this.setData({
      list:res.data
    });
    console.log(res.data);
    wx.hideLoading();
  },

  // 复选选中事件
 async onChange(e){
    console.log(e);
    wx.showLoading({
      title: '修改中',
      mask:true
    });

    const checked =e.detail;
    const _id = e.target.dataset.id;
    await collection.doc(_id).update({
      data:{
        checked:checked
      }
    })
   
    wx.showToast({
      title:"修改成功"
    });
    this.onShow();


    
  },
// 删除图标
 async unpdelete(e){
  wx.showModal({
    title:"警告",
    content:"你确定删除吗？",
    cancelColor: 'true',
    cancelText:"取消",
    cancelColor:"#000000",
    confirmText:"确定",
    confirmColor:"#3CC51F",
    success:async (result) =>{
      if(result.confirm) {
        wx.showLoading({
          title: '删除中',
          mask:true
        });
        // id 数据库表格的id
        const _id = e.target.dataset.id;
        // 获取到 这个一条数据 文件id存放在这个数据里面
        const item = await collection.doc(_id).get();
        await collection.doc(_id).remove();//删除数据库
        // 图片的 id fileID 
        const res = await wx.cloud.deleteFile({fileList:['item.data.url']})
        // 隐藏提示
        wx.hideLoading();

        this.onShow();
      }
    },
    fail:()=>{},
    complete:() =>{}
  })
}
})
