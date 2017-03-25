# Web 移动端手势密码

## 图片演示

![演示](https://github.com/sone47/pattern-lock/blob/master/demo.gif)

## Usage

```html
<!-- 画布 -->
<canvas id="context"></canvas>
<!-- 选择设置密码还是修改密码的单选按钮，value 设置密码为 0，验证密码为 1 -->
<form id="setStatus">
  <label>
    <input type="radio" name="password" checked="checked" value="0">
    设置密码
  </label>
  <label>
    <input type="radio" name="password" value="1">
    验证密码
  </label>
</form>
<script>
  new Lock(options);
</script>
```

### options

`options` 是一个对象，属性值及用法如下：

|        属性名        |      属性类型      |           属性意义           |        默认值        |
| :---------------: | :------------: | :----------------------: | :---------------: |
|     ele (必须)      | Element Object | 作为画布的标签，是一个 `canvas`  元素 |         /         |
|   formELE (必须)    | Element Object |     选择设置密码还是验证密码的表单      |         /         |
|       width       |     Number     |           画布的宽           | window.innerWidth |
|      height       |     Number     |           画布的高           |        300        |
|         n         |     Number     |      将密码设置为 nxn 的形式      |         3         |
|  originFillColor  |     String     |       未锁定的密码点的填充色        |    transparent    |
|     fillColor     |     String     |       已锁定的密码点的填充色        |       \#ccc       |
| originStrokeColor |     String     |       未锁定的密码点的轮廓色        |       \#fff       |
|    strokeColor    |     String     |       已锁定的密码点的轮廓色        |       \#fff       |
|      border       |     Number     |          密码点的边宽          |         2         |
|     lineColor     |     String     |         密码路径的颜色          |       \#999       |
|     lineWidth     |     Number     |         密码路径的宽度          |         2         |
|     fontSize      |     Number     |          提示字的大小          |        16         |
|      radius       |     Number     |          密码点的半径          |        14         |
|      marginX      |     Number     |         密码点的水平边距         |        38         |
|      marginY      |     Number     |         密码点的垂直边距         |        34         |
|      atleast      |     Number     |       至少需要锁定几个密码点        |         5         |
|       tips        |     Object     |        输入密码时的提示内容        |        如下         |

(PS: / 表示没有默认值)

#### tips

|    属性名    |       属性意义       |     默认值      |
| :-------: | :--------------: | :----------: |
| original  |       初始值        |   请输入手势密码    |
| tooshort  | 密码小于 `atleast` 时 | 密码太短，至少需要5个点 |
|  repeat   |   要求输入第二次设置密码    |  请再次输入手势密码   |
|  success  |      密码设置成功      |    密码设置成功    |
| different |    两次密码输入不一致     |   两次输入不一致    |
|   wrong   |      验证密码错误      |    密码不正确     |
|   right   |      验证密码正确      |    密码正确！     |

属性类型全为 `String` 。