#!/usr/bin/env node
// 사용 예: node scripts/hash-password.js "내비밀번호"
// 게시글 비밀번호용 bcrypt 해시 생성기. 관리자 비번은 평문 환경변수로 두므로
// 일반적으로 필요 없지만, admins 테이블을 직접 채울 때 활용할 수 있다.

const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

(async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
})();
