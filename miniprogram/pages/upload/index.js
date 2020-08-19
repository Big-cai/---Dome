// pages/upload/index.js
const db = wx.cloud.database();
const collection = db.collection("test");
Page({
  data: {  
    name:"",
    fileList:[]
  },

  onChange(event) {
    // event.detail 为当前输入的值
    // 将输入框里面的存入data里面
    this.setData({
      name:event.detail
    })

  },

  // 图片上传到缓存的时候触发 
 async afterRead(event) {
    const {file} = event.detail;
    console.log(file.path);
    // let ss={url:file.path}
    // this.data.fileList.push(ss)
    // let aaa=this.data.fileList
    this.setData({
      fileList:[{url:file.path}]
    })
  },
  // 点击开始上传按钮
  async handleUpload(){
    // 1.点击文件上传的时候 获取到了图片的缓存地址
    // 2.点击开始上传按钮
    //     1.获取输出框里面的值
    //     2.获取 图片的缓存地址
    //     3.非空校验
    //     4.将缓存图片上传到 云存储-->返回一个 云地址
    //       test {
    //         name，url,checked
    //       }
    const {name,fileList} = this.data;
    if(!name.trim() || !fileList.length) {
      wx.showToast({
        title:"名称或者头像不能为空",
        icon:"none",
      });
    }

    wx.showLoading({
      title:'拼命上传中...',
      mask:true
    });
    const filePath = fileList[0].url;
    const lastIndex = filePath.lastIndexOf(".");
    const extName = filePath.substr(lastIndex);
    const fileName = Math.round(Math.random() * Date.now()*1000) + extName;


    const res =await wx.cloud.uploadFile({
      cloudPath:fileName,
      filePath:filePath
    });

    const test = {
      name,
      url:res.fileID,
      checked:false
    };

    await collection.add({
      data:test
    })
    wx.showLoading();

    wx.showLoading({
      title: '上传成功',
    });

    setTimeout(()=>{
      wx.switchTab({
        url: '/pages/index/index',
      })
    },2000);
  }
})