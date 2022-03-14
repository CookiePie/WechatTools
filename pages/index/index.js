// index.js
Page({
    data:{
        openId: "",
        nickname: "",
        realname: "",
        avatar_url: "",
        hasLogin: false,
        userid: "",
        userpass: ""
    },
    onLoad() {
        var that = this;
        wx.getStorage({
            key: 'userProfile',
            success (res) {
                that.setData({
                    avatar_url: res.data.avatarUrl,
                    nickname: res.data.nickname
                })
            }
        }),
        wx.getStorage({
            key: 'openid',
            success (res) {
                console.log('Load from local')
                that.setData({
                    openId: res.data
                })
                console.log(res.data)
            },
            fail () {
                if (!that.data.openId) {
                    wx.login({
                        success (res) {
                            if (res.code) {
                                wx.request({
                                    url: 'https://www.hi-cpy.xyz:805/tools',
                                    data: {
                                        code: res.code
                                    },
                                    success (res) {
                                        that.setData({
                                            openId:res.data.openid
                                        })
                                        console.log(that.data.openId)
                                        wx.setStorageSync('openid', res.data.openid)
                                    }
                                })
                            } else {
                                console.log('Login Error')
                            }
                        }
                    })
                } else {
        
                }
            }
        })
    },
    getUserProfile (e) {
        var that=this;
        wx.getUserProfile({
            desc: '初始化个人信息',
            success (res) {
                console.log(res)
                wx.setStorageSync('userProfile', {
                    avatarUrl: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickname
                })
                that.setData({
                    avatar_url: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickname
                })
            }
          })
    }
})
