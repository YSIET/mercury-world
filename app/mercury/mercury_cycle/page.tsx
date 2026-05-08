import SubPageLayout from "@/components/SubPageLayout";

const __HTML = `<!--con -->
	
	<table width="700" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td colspan="2" align="center"><img src="/img/mercury/2_1.gif" /></td>
      </tr>
	  <tr>
        <td height="10" colspan="2"></td>
      </tr>
      <tr>
        <td colspan="2" align="center" class="bold">수은순환과생물농축 (Mercury Cycle and Bioaccumulation)</td>
      </tr>
	  <tr>
        <td height="27" colspan="2"></td>
      </tr>
	  </table>
	  <table width="95%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td height="40" colspan="2" class="c2 bold"><img src="/img/common/icon_b8.gif" width="13" height="13" align="absmiddle" /> <img src="/img/mercury/st2_01.gif" align="absmiddle" /></td>
        </tr>
        <tr>
          <td width="3%" align="center"><img src="/img/common/icon03.gif" /></td>
          <td width="97%">지면이나 물속에 수은이 원소형태로 대기상으로 배출</td>
        </tr>
        <tr>
          <td align="center"><img src="/img/common/icon03.gif" /></td>
          <td>가스상태로 대기권에서 장거리 이동</td>
        </tr>
        <tr>
          <td align="center"><img src="/img/common/icon03.gif" /></td>
          <td>바다/지면으로 습식/건식 침전</td>
        </tr>
        <tr>
          <td align="center"><img src="/img/common/icon03.gif" /></td>
          <td>침전물에 흡착</td>
        </tr>
        <tr>
          <td align="center"><img src="/img/common/icon03.gif" /></td>
          <td>먹이사슬 내 생물농축</td>
        </tr>
        <tr>
          <td height="20" align="center">&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </table>
	  <table width="95%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="56%">생물농축이란 시간이 지나면서 생물 내 어느 한 물질의 농도가 주변 환경의 농도보다  
            더 높아지는 것을 말한다. 생물농축은 어느 생물이던지 꼭 필요한 것이기도 하지만,  
            불필요한 물질이 생물농축이 될 경우 해가 될 수 있다.  
            사람을 비롯한 모든 동물들은 비타민 A, D, K, 미네랄, 아미노산과 같은 필요한 영양분을  
            체내 축적한다. <br />
            하지만 납이나 수은과 같이 해로운 물질도 체내 축적이 된다. 어떠한 
            물질이 생체 내로 흡수되는 양보다 배설되거나 분해되는 양이 더 적을 경우 그 물질은  
            생체농축이 된다. 생물농축은 종별에 따라 많은 차이가 난다.  
            수명이 길고 큰 생물체가 수명이 짧고 작은 생물체 보다 생물농축이 더 많이된다.</td>
        </tr>
        <tr>
          <td height="20"></td>
        </tr>
        <tr>
          <td>메틸수은은 가장 흔한 종의 수은이고 생물체에 있어서 가장 해로운 종이기도 하다.  
            메틸수은은 생물체에 의해 쉽게 흡수되고, 조직에 축적이 된다.  
            지방에 축적되는 다른 유해물질과 달리 수은은 조직 내에 축적이 되기 때문에, 생선을 
            섭취하게 될 때 수은에 오염된 부위를 제거하는 것이 어렵다.</td>
        </tr>
      </table>`;

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={1200}
      sideGroup={1200}
      activePath="/mercury/mercury_cycle"
      leftCategory="mercury"
      heroImg="/img/mercury/img.gif"
      titleImg="/img/mercury/title_2.gif"
      breadcrumb={<>HOME &gt; 수은백서 &gt; 수은순환과생물농축</>}
    >
      <div dangerouslySetInnerHTML={{ __html: __HTML }} />
    </SubPageLayout>
  );
}
