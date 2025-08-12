#!/bin/bash

# 批量修正 listSubscription 函數調用的腳本
# 移除第4個參數 durationSeconds

echo "開始修正 listSubscription 函數調用..."

# 修正所有 TypeScript 和 TSX 文件
find . -name "*.tsx" -o -name "*.ts" | while read -r file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".next"* ]]; then
        # 檢查文件是否包含 listSubscription
        if grep -q "listSubscription" "$file"; then
            echo "處理文件: $file"
            
            # 使用 sed 來替換函數調用
            # 模式：listSubscription(arg1, arg2, arg3, arg4) -> listSubscription(arg1, arg2, arg3)
            sed -i '' 's/listSubscription(\([^,]*\),\s*\([^,]*\),\s*\([^,]*\),\s*[^)]*)/listSubscription(\1, \2, \3)/g' "$file"
            
            # 處理多行調用的情況
            # 先標記開始行
            sed -i '' '/listSubscription(/,/)/{ 
                /listSubscription(/{
                    :a
                    n
                    /)/!ba
                    s/,\s*[^,)]*)/)/
                }
            }' "$file"
        fi
    fi
done

echo "修正完成！"
