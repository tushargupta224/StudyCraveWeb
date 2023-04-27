<template>
    <n-card class="n-card">
        <div class="form-heading">
            <h3>✨ Create your Channel</h3>
        </div>
        <div class="form-subheading">
            How does you want your channel to look like?
        </div>

        <div class="form-container">
            <label for="channel-name">Channel's Name</label>
            <input type="text" id="channel-name" name="channel-name" required>

            <label for ='participants'>Number of participants</label>
            <input type="number" id="particiapnts" name="participants" required min="1">

            <label for="description">Channel's Description</label>
            <input type="text" id="description" name="description">

            
        </div>
        <div>
            <button class="form-btn">Create Channel</button>
        </div>
    </n-card>

</template>


<script lang="ts">
import {defineComponent} from 'vue';
import {NCard} from 'naive-ui';


export default defineComponent ({
    components:{
        NCard,
        
    },
    
})



</script>

<style lang="scss" scoped>
.n-card{
    display: flex;
    flex-direction: column;
    width: 500px;
    border-radius: 25px;
}
.form-heading h3{
    font-size: 1.8rem;
    margin-bottom: 5px;
}
.form-subheading{
    position: relative;
    font-size: 0.8rem;
    font-weight: 400;
    font-style: italic;
    padding: 0 2%;
}
.form-container{
    display: flex;
    flex-direction: column;
    & label{
        margin-top: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    & input{
        width: 400px;
        height: 35px;
        border: 1px solid black;
        border-radius: 10px;
        outline: none;
        font-size: 1rem;
        font-weight: 500;
        padding: 0 2%;
    }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.form-btn{
    cursor: pointer;
    position: relative;
    background: #FDD199;
    border: 1px solid #FDD199;
    padding: 2%;
    border-radius: 12px;
    float: right;
    margin-top: 15px;
    right: 8%;
}
.form-btn:hover{
    transform: scale(1.04);
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
}


</style>