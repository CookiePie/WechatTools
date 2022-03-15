// index.js
Page({
    data:{
        openId: "",
        nickname: "",
        realname: "",
        avatarUrl: "",
        hasLogin: "0",
        status: "**报备模式待选择**",
        status_code: "0",
        status_color: "burlywood",
        user_type: "0",
        random_ex: {
            r1: "",
            r2: "",
            r3: ""
        },
    },
    onLoad() {
        var that = this;
        wx.request({
            url: 'https://www.hi-cpy.xyz:805/tools',
            data: {
                getRandom: "1"
            },
            success (res) {
              that.setData({
                  random_ex: res.data
              })
            }
          })
        wx.request({
            url: 'https://www.hi-cpy.xyz:805/words/',
            data:{question:'pokemon'},
            success: function(res) {
            if (res.statusCode === 200) {
                that.setData({
                pokemon_pic:res.data
                })
            }}
        })
        wx.getStorage({
            key: 'userProfile',
            success (res) {
                that.setData({
                    avatarUrl: res.data.avatarUrl,
                    nickname: res.data.nickname
                })
                console.log(that.data.avatarUrl)
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
                wx.request({
                    url: 'https://www.hi-cpy.xyz:805/tools',
                    data:{
                        hasLogin:that.data.hasLogin,
                        openid:that.data.openId
                    },
                    success (res) {
                        that.setData({
                            hasLogin:res.data.hasLogin
                        })
                    }
                    })
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
                    nickname: res.userInfo.nickName
                })
                that.setData({
                    avatarUrl: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                })
            }
          })
    },
    formSubmit(e) {
        var that=this
        that.setData({
            status: "正在登陆，请稍后……"
        })
        wx.request({
          url: 'https://www.hi-cpy.xyz:805/tools',
          data: {
              userid: e.detail.value.userid,
              userpass: e.detail.value.userpass,
              user_type: that.data.user_type,
              hasLogin: that.data.hasLogin,
              openid: that.data.openId,
              random_ex: "0",
          },
          success(res){
            console.log(res)
            that.setData({
                status: res.data.status,
            })
            if (res.data.status_code == "101") {
                that.setData({
                    hasLogin: "1"
                })
            }
          },
          fail (res) {
              that.setData({
                  status: "登陆超时，请重试😭"
              })
          }
        })
    },
    getRandomEx(e) {
        var that=this
        wx.request({
          url: 'https://www.hi-cpy.xyz:805/tools',
          data: {
              getRandom: "1"
          },
          success (res) {
            that.setData({
                random_ex: res.data
            })
          }
        })
    },
    primaryBaobei(e) {
        var that=this;
        console.log(e.target.dataset.user_type)
        that.setData({
            status: '正在报备，请稍等……'
        })
        wx.request({
          url: 'https://www.hi-cpy.xyz:805/tools',
          data:{
              userid: "1",
              userpass: "1",
              openid: that.data.openId,
              hasLogin: that.data.hasLogin,
              user_type: e.target.dataset.user_type,
              random_ex: that.data.random_ex
          },
          timeout: 60000,
          success (res) {
              that.setData({
                  status: res.data.status
              });
              if (res.data.status_code == "233") {
                  that.setData({
                      status_color: "green"
                  })
              } else {
                that.setData({
                    status_color: "red"
                })
              }
          },
          fail (res) {
              that.setData({
                  status: "请求超时……",
                  status_color: "red"
              })
          }
        })
    },
    onReachBottom: function () {
        var that=this
        wx.request({
            url: 'https://www.hi-cpy.xyz:805/words/',
            data:{question:'pokemon'},
            success: function(res) {
            if (res.statusCode === 200) {
                that.setData({
                pokemon_pic:res.data
                })
            }
            }
        })
      },
})
