import SubPageLayout from "@/components/SubPageLayout";

const __HTML = `<!--con -->
		<form name=frm1>

		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td class="c2 bold"><img src="/img/content/content_1.gif" /></td>
			<td width="30%" valign="bottom" class="c2 bold">
				<table border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td><strong>몸무게</strong>&nbsp;</td>
					<td>
						<input name="w" type="text" size="15" style=" background-color:#ffffff; border:solid 2px #FF6600"  />
						kg
					</td>
				</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td width="70%" class="c2 bold" style="padding-bottom:3px"><img src="/img/content/content_1_1.gif" /></td>
			<td valign="bottom" class="c2 bold"><img src="/img/content/mer_ok.gif" onclick="t_s()" style="cursor:hand" /> <img src="/img/content/mer_cancel.gif" style="cursor:hand" onclick="javascript:document.frm1.reset()"/></td>
		</tr>
		</table>

		<table width="700" border="1" bordercolor="#CCCCCC" align="center" cellpadding="10" cellspacing="0" frame="hsides" style="border-collapse:collapse; ">
		<tr>
			<td width="50" align="center" bgcolor="#CFEAEF"><strong>분류</strong></td>
			<td width="350" align="center" bgcolor="#CFEAEF"><strong>내용물</strong></td>
			<td width="150" align="center" bgcolor="#CFEAEF"><strong>식사량</strong></td>
			<td width="150" align="center" bgcolor="#CFEAEF"><span style="font-weight: bold">비고</span></td>
		</tr>

		<tr>
			<td align="center" bgcolor="#F5FBFE"><strong></strong></td>
			<td align="center"></td>
			<td align="right" bgcolor="#F1FAFA"></td>
			<td align="right"></td>
		</tr>

		<!--
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>
  잡곡
    </strong>
    <td align="center">

      <input type="checkbox" name="checkbox" id="checkbox31" />
      백미
  <input type="checkbox" name="checkbox2" id="checkbox2" />
      밀가루
  <input type="checkbox" name="checkbox3" id="checkbox3" />
      밀가루
  <input type="checkbox" name="checkbox4" id="checkbox4" />
      밀가루
  <input type="checkbox" name="checkbox5" id="checkbox5" />
      밀가루<br />
  <input type="checkbox" name="checkbox2" id="checkbox" />
      백미
  <input type="checkbox" name="checkbox2" id="checkbox2" />
      밀가루
  <input type="checkbox" name="checkbox3" id="checkbox3" />
      밀가루
  <input type="checkbox" name="checkbox4" id="checkbox4" />
      밀가루
  <input type="checkbox" name="checkbox5" id="checkbox5" />
      밀가루<br />
  <input type="checkbox" name="checkbox2" id="checkbox" />
      백미
  <input type="checkbox" name="checkbox2" id="checkbox2" />
      밀가루
  <input type="checkbox" name="checkbox3" id="checkbox3" />
      밀가루
  <input type="checkbox" name="checkbox4" id="checkbox4" />
      밀가루
  <input type="checkbox" name="checkbox5" id="checkbox5" />
      밀가루<br />
  <input type="checkbox" name="checkbox10" id="checkbox26" />
      백미
  <input type="checkbox" name="checkbox10" id="checkbox27" />
      밀가루
  <input type="checkbox" name="checkbox10" id="checkbox28" />
      밀가루
  <input type="checkbox" name="checkbox10" id="checkbox29" />
      밀가루
  <input type="checkbox" name="checkbox10" id="checkbox30" />
    밀가루<br />  </td>

  <td align="right" bgcolor="#F1FAFA">백미
    <input name="textfield" type="text" id="textfield" class="input_content" size="3" /> g  </td>

  <td align="right">백미1공기 : 10g</td>
  </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>과일</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox6" id="checkbox6" />
      사과
      <input type="checkbox" name="checkbox6" id="checkbox7" />
      배
      <input type="checkbox" name="checkbox6" id="checkbox8" />
      수박<br />    </td>
    <td align="right" bgcolor="#F1FAFA">수박
      <input name="textfield2" type="text" id="textfield2" class="input_content" size="3" /> g </td>
    <td align="right">수박1통 : 100g</td>
  </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>나물</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox7" id="checkbox11" />
      치나물
      <input type="checkbox" name="checkbox7" id="checkbox12" />
      드룹
      <input type="checkbox" name="checkbox7" id="checkbox13" />
      고사리<br />    </td>
    <td align="right" bgcolor="#F1FAFA">고사리
      <input name="textfield3" type="text" id="textfield3" class="input_content" size="3" /> g<br />
    드룹
    <input name="textfield14" type="text" id="textfield14" class="input_content" size="3" /> g</td>
    <td align="right">고사리 1그릇 : 5g<br />
      두릅 1그룻 : 3g</td>
  </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>조미료</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox8" id="checkbox16" />
      미원
      <input type="checkbox" name="checkbox8" id="checkbox17" />
      다시다
      <input type="checkbox" name="checkbox8" id="checkbox18" />
      후추<br />    </td>
    <td align="right" bgcolor="#F1FAFA">다시다
      <input name="textfield4" type="text" id="textfield4" class="input_content" size="3" /> g<br />
      후추
        <input name="textfield5" type="text" id="textfield5" class="input_content" size="3" /> g </td>
    <td align="right">다시다 1스푼 : 1g<br />
      후추 1스푼 : 1g</td>
  </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>면</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox9" id="checkbox21" />
      국수
      <input type="checkbox" name="checkbox9" id="checkbox22" />
      라면
      <input type="checkbox" name="checkbox9" id="checkbox23" />
      메밀<br />    </td>
    <td align="right" bgcolor="#F1FAFA">라면
      <input name="textfield6" type="text" id="textfield6" class="input_content" size="3" /> g </td>
    <td align="right">라면 1개 : 3g</td>
  </tr>
    <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>부식</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox6" id="checkbox6" />
      백미
      <input type="checkbox" name="checkbox6" id="checkbox7" />
      밀가루
      <input type="checkbox" name="checkbox6" id="checkbox8" />
      밀가루
      <input type="checkbox" name="checkbox6" id="checkbox9" />
      밀가루
      <input type="checkbox" name="checkbox6" id="checkbox10" />
      밀가루<br />    </td>
    <td align="right" bgcolor="#F1FAFA">백미
      <input name="textfield7" type="text" id="textfield7" class="input_content" size="3" /> g </td>
    <td align="right">&nbsp;</td>
    </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>스낵</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox7" id="checkbox11" />
      백미
      <input type="checkbox" name="checkbox7" id="checkbox12" />
      밀가루
      <input type="checkbox" name="checkbox7" id="checkbox13" />
      밀가루
      <input type="checkbox" name="checkbox7" id="checkbox14" />
      밀가루
      <input type="checkbox" name="checkbox7" id="checkbox15" />
    밀가루<br />    </td>
    <td align="right" bgcolor="#F1FAFA">백미
      <input name="textfield8" type="text" id="textfield8" class="input_content" size="3" /> g </td>
    <td align="right">&nbsp;</td>
  </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>음료</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox8" id="checkbox16" />
      백미
      <input type="checkbox" name="checkbox8" id="checkbox17" />
      밀가루
      <input type="checkbox" name="checkbox8" id="checkbox18" />
      밀가루
      <input type="checkbox" name="checkbox8" id="checkbox19" />
      밀가루
      <input type="checkbox" name="checkbox8" id="checkbox20" />
    밀가루<br />    </td>
    <td align="right" bgcolor="#F1FAFA">백미
      <input name="textfield9" type="text" id="textfield9" class="input_content" size="3" /> g </td>
    <td align="right">&nbsp;</td>
  </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>해산물</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox9" id="checkbox21" />
      백미
      <input type="checkbox" name="checkbox9" id="checkbox22" />
      밀가루
      <input type="checkbox" name="checkbox9" id="checkbox23" />
      밀가루
      <input type="checkbox" name="checkbox9" id="checkbox24" />
      밀가루
      <input type="checkbox" name="checkbox9" id="checkbox25" />
    밀가루<br />    </td>
    <td align="right" bgcolor="#F1FAFA">백미
      <input name="textfield10" type="text" id="textfield10" class="input_content" size="3" /> g </td>
    <td align="right">&nbsp;</td>
  </tr>
    <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>김치</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox6" id="checkbox6" />
      백미
      <input type="checkbox" name="checkbox6" id="checkbox7" />
      밀가루
      <input type="checkbox" name="checkbox6" id="checkbox8" />
      밀가루
      <input type="checkbox" name="checkbox6" id="checkbox9" />
      밀가루
      <input type="checkbox" name="checkbox6" id="checkbox10" />
      밀가루<br />    </td>
    <td align="right" bgcolor="#F1FAFA">백미
      <input name="textfield11" type="text" id="textfield11" class="input_content" size="3" /> g </td>
    <td align="right">&nbsp;</td>
    </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>고기</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox7" id="checkbox11" />
      백미
      <input type="checkbox" name="checkbox7" id="checkbox12" />
      밀가루
      <input type="checkbox" name="checkbox7" id="checkbox13" />
      밀가루
      <input type="checkbox" name="checkbox7" id="checkbox14" />
      밀가루
      <input type="checkbox" name="checkbox7" id="checkbox15" />
    밀가루<br />    </td>
    <td align="right" bgcolor="#F1FAFA">백미
      <input name="textfield12" type="text" id="textfield12" class="input_content" size="3" /> g </td>
    <td align="right">&nbsp;</td>
  </tr>
  <tr>
    <td align="center" bgcolor="#F5FBFE"><strong>야채</strong></td>
    <td align="center">
      <input type="checkbox" name="checkbox8" id="checkbox16" />
      백미
      <input type="checkbox" name="checkbox8" id="checkbox17" />
      밀가루
      <input type="checkbox" name="checkbox8" id="checkbox18" />
      밀가루
      <input type="checkbox" name="checkbox8" id="checkbox19" />
      밀가루
      <input type="checkbox" name="checkbox8" id="checkbox20" />
    밀가루<br />    </td>
    <td align="right" bgcolor="#F1FAFA">백미
      <input name="textfield13" type="text" id="textfield13" class="input_content" size="3" /> g </td>
    <td align="right">&nbsp;</td>
  </tr>  -->
		</table>
		</form>
		<table width="697" border="0" align="center" cellpadding="0" cellspacing="0">
		<tr>
			<td align="center"><a href="http://fsi.seoul.go.kr/" target="_blank"><img src="/img/content/content_3.gif" border="0" /></a></td>
		</tr>
		</table>`;

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={1500}
      sideGroup={1500}
      activePath="/content/content"
      leftCategory="content"
      heroImg="/img/content/img.gif"
      titleImg="/img/content/title_1.gif"
      breadcrumb={<>HOME &gt; 식품속수은 &gt; 수은섭취량테스트</>}
    >
      <div dangerouslySetInnerHTML={{ __html: __HTML }} />
    </SubPageLayout>
  );
}
