# Web 移动端手势密码

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

| 属性名               | 属性类型           | 属性意义                     |
| :---------------- | -------------- | ------------------------ |
| ele (必须)          | Element Object | 作为画布的标签，是一个 `canvas`  元素 |
| formELE (必须)      | Element Object | 选择设置密码还是验证密码的表单          |
| width             | Number         | 画布的宽                     |
| height            | Number         | 画布的高                     |
| n                 | Number         | 将密码设置为 nxn 的形式           |
| originFillColor   | String         | 未锁定的密码点的填充色              |
| fillColor         | String         | 已锁定的密码点的填充色              |
| originStrokeColor | String         | 未锁定的密码点的轮廓色              |
| strokeColor       | String         | 已锁定的密码点的轮廓色              |
| border            | Number         | 密码点的边宽                   |
| lineColor         | String         | 密码路径的颜色                  |
| lineWidth         | Number         | 密码路径的宽度                  |
| fontSize          | Number         | 提示字的大小                   |
| radius            | Number         | 密码点的半径                   |
| marginX           | Number         | 密码点的水平边距                 |
| marginY           | Number         | 密码点的垂直边距                 |
| atleast           | Number         | 至少需要锁定几个密码点              |
| tips              | Object         | 输入密码时的提示内容               |

#### tips

| 属性名       | 属性意义             |
| --------- | ---------------- |
| original  | 什么也没做时           |
| tooshort  | 密码小于 `atleast` 时 |
| repeat    | 要求输入第二次设置密码      |
| success   | 密码设置成功           |
| different | 两次密码输入不一致        |
| wrong     | 验证密码错误           |
| right     | 验证密码正确           |

属性类型全为 `String` 。