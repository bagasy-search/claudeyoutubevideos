cd D:/Proyectos/video2-wt/tfbtanque
R() { node scripts/agnes_vlog.mjs vlog/tfbtanque/plans/$1.json clips "${@:2}" > out/logs/regen1_$1.log 2>&1; }
R S1 S1_01 & R S3 S3_04b S3_06b S3_12 & R S4 S4_09 & R S10 S10_01 S12_13a & R S12 S12_01 S12_06 & wait
echo REGEN1_FIN
